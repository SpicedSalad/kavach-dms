#!/usr/bin/env bash
# Copyright KavachDMS Project. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# ---------------------------------------------------------------------------
# KavachDMS Fabric Network Lifecycle
# ---------------------------------------------------------------------------
# Usage:
#   ./network.sh up      — Generate crypto, genesis block, start containers
#   ./network.sh down    — Stop and remove containers
#   ./network.sh clean   — Full cleanup (containers, volumes, generated files)
#
# This script does NOT depend on chaincode being present.
# Chaincode deployment is handled separately by deploy-chaincode.sh.
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FABRIC_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=utils.sh
source "${SCRIPT_DIR}/utils.sh"

# Fabric image versions
FABRIC_VERSION="2.5"
FABRIC_CA_VERSION="1.5"

# ---------------------------------------------------------------------------
# Generate crypto material using cryptogen (via Docker container)
# ---------------------------------------------------------------------------
function generateCryptoMaterial() {
  infoln "Generating crypto material with cryptogen..."

  # Create output directory
  mkdir -p "${FABRIC_ROOT}/organizations"

  # Generate Org1 crypto
  docker run --rm \
    -v "${FABRIC_ROOT}/config:/config" \
    -v "${FABRIC_ROOT}/organizations:/organizations" \
    hyperledger/fabric-tools:${FABRIC_VERSION} \
    cryptogen generate --config=/config/crypto-config-org1.yaml --output=/organizations

  verifyResult $? "Failed to generate Org1 crypto material"
  successln "Org1 crypto material generated"

  # Generate Orderer crypto
  docker run --rm \
    -v "${FABRIC_ROOT}/config:/config" \
    -v "${FABRIC_ROOT}/organizations:/organizations" \
    hyperledger/fabric-tools:${FABRIC_VERSION} \
    cryptogen generate --config=/config/crypto-config-orderer.yaml --output=/organizations

  verifyResult $? "Failed to generate Orderer crypto material"
  successln "Orderer crypto material generated"
}

# ---------------------------------------------------------------------------
# Generate application channel genesis block for channel participation API
# ---------------------------------------------------------------------------
function generateChannelGenesisBlock() {
  infoln "Generating application channel genesis block..."

  mkdir -p "${FABRIC_ROOT}/channel-artifacts"

  # With channel participation API (Fabric 2.5), we generate the
  # application channel genesis block directly. No system channel needed.
  docker run --rm \
    -v "${FABRIC_ROOT}/config:/config" \
    -v "${FABRIC_ROOT}/organizations:/organizations" \
    -v "${FABRIC_ROOT}/channel-artifacts:/channel-artifacts" \
    -e FABRIC_CFG_PATH=/config \
    hyperledger/fabric-tools:${FABRIC_VERSION} \
    configtxgen -profile KavachGenesis \
      -outputBlock /channel-artifacts/kavachdms-channel.block \
      -channelID kavachdms-channel

  verifyResult $? "Failed to generate channel genesis block"
  successln "Channel genesis block generated"
}


# ---------------------------------------------------------------------------
# Start the Fabric network
# ---------------------------------------------------------------------------
function networkUp() {
  separator
  infoln "Starting KavachDMS Fabric Network"
  separator

  checkDocker

  # Check if network is already running
  if docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | grep -q "orderer"; then
    warnln "Fabric network appears to be already running."
    warnln "Run './network.sh down' first, or './network.sh clean' for a fresh start."
    exit 0
  fi

  # Check if crypto material exists; generate if not
  if [ ! -d "${FABRIC_ROOT}/organizations/peerOrganizations" ]; then
    generateCryptoMaterial
  else
    infoln "Crypto material already exists, skipping generation"
  fi

  # Check if channel genesis block exists; generate if not
  if [ ! -f "${FABRIC_ROOT}/channel-artifacts/kavachdms-channel.block" ]; then
    generateChannelGenesisBlock
  else
    infoln "Channel genesis block already exists, skipping generation"
  fi

  # Create Fabric CA server directory if needed
  mkdir -p "${FABRIC_ROOT}/organizations/fabric-ca/org1"

  # Start Docker containers
  infoln "Starting Docker containers..."
  docker compose -f "${FABRIC_ROOT}/compose/docker-compose.yaml" up -d

  verifyResult $? "Failed to start Docker containers"

  # Wait for containers to be healthy
  infoln "Waiting for containers to start..."
  sleep 5

  # Verify containers are running
  local running_count
  running_count=$(docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | wc -l)

  if [ "$running_count" -lt 3 ]; then
    errorln "Expected at least 3 containers, but only ${running_count} are running"
    docker ps --filter "label=project=kavach-fabric" --format "table {{.Names}}\t{{.Status}}"
    fatalln "Network startup failed. Check container logs with: docker logs <container_name>"
  fi

  separator
  successln "KavachDMS Fabric Network is running!"
  separator
  echo ""
  docker ps --filter "label=project=kavach-fabric" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  echo ""
  infoln "Next steps:"
  infoln "  1. Create channel:     ./scripts/create-channel.sh"
  infoln "  2. Deploy chaincode:   ./scripts/deploy-chaincode.sh"
  infoln "  3. Generate profile:   ./scripts/generate-connection-profile.sh"
}

# ---------------------------------------------------------------------------
# Stop the Fabric network
# ---------------------------------------------------------------------------
function networkDown() {
  separator
  infoln "Stopping KavachDMS Fabric Network"
  separator

  docker compose -f "${FABRIC_ROOT}/compose/docker-compose.yaml" down --volumes --remove-orphans 2>/dev/null || true

  # Remove any lingering chaincode containers
  docker rm -f $(docker ps -aq --filter "name=dev-peer*") 2>/dev/null || true

  successln "Fabric network stopped"
}

# ---------------------------------------------------------------------------
# Full cleanup
# ---------------------------------------------------------------------------
function networkClean() {
  separator
  infoln "Cleaning KavachDMS Fabric Network (full reset)"
  separator

  # Stop network first
  networkDown

  # Remove generated crypto material
  if [ -d "${FABRIC_ROOT}/organizations/peerOrganizations" ]; then
    rm -rf "${FABRIC_ROOT}/organizations/peerOrganizations"
    infoln "Removed peer organizations crypto"
  fi

  if [ -d "${FABRIC_ROOT}/organizations/ordererOrganizations" ]; then
    rm -rf "${FABRIC_ROOT}/organizations/ordererOrganizations"
    infoln "Removed orderer organizations crypto"
  fi

  if [ -d "${FABRIC_ROOT}/organizations/fabric-ca" ]; then
    rm -rf "${FABRIC_ROOT}/organizations/fabric-ca"
    infoln "Removed Fabric CA data"
  fi

  # Remove channel artifacts (but keep .gitkeep)
  find "${FABRIC_ROOT}/channel-artifacts" -type f ! -name '.gitkeep' -delete 2>/dev/null || true
  infoln "Removed channel artifacts"

  # Remove connection profiles (but keep .gitkeep)
  find "${FABRIC_ROOT}/connection-profile" -type f ! -name '.gitkeep' -delete 2>/dev/null || true
  infoln "Removed connection profiles"

  # Remove chaincode packages
  find "${FABRIC_ROOT}" -maxdepth 1 -name "*.tar.gz" -delete 2>/dev/null || true

  # Remove chaincode Docker images
  docker image rm -f $(docker images -aq --filter reference='dev-peer*') 2>/dev/null || true

  successln "Full cleanup complete. Run './network.sh up' for a fresh start."
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
case "${1:-}" in
  up)
    networkUp
    ;;
  down)
    networkDown
    ;;
  clean)
    networkClean
    ;;
  *)
    echo "Usage: $0 {up|down|clean}"
    echo ""
    echo "Commands:"
    echo "  up     Generate crypto material, start Fabric containers"
    echo "  down   Stop and remove containers"
    echo "  clean  Full cleanup (containers, volumes, crypto, artifacts)"
    exit 1
    ;;
esac
