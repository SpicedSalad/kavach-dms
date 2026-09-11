#!/usr/bin/env bash
# Copyright KavachDMS Project. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# ---------------------------------------------------------------------------
# KavachDMS — Create and Join Channel (Channel Participation API)
# ---------------------------------------------------------------------------
# Uses the Fabric 2.5 channel participation API (osnadmin) to:
#   1. Join the orderer to the channel
#   2. Join peer0.org1 to the channel
#   3. Set anchor peer
#
# Must be run after './network.sh up'.
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FABRIC_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=utils.sh
source "${SCRIPT_DIR}/utils.sh"

CHANNEL_NAME="kavachdms-channel"

# Paths
ORDERER_TLS_DIR="${FABRIC_ROOT}/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/tls"
ORDERER_CA="${FABRIC_ROOT}/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem"

# ---------------------------------------------------------------------------
# Verify network is running
# ---------------------------------------------------------------------------
function verifyNetwork() {
  if ! docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | grep -q "peer0"; then
    fatalln "Fabric network is not running. Run './network.sh up' first."
  fi
  if ! docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | grep -q "orderer"; then
    fatalln "Orderer is not running. Run './network.sh clean' then './network.sh up'."
  fi
  infoln "Fabric network is running"
}

# ---------------------------------------------------------------------------
# Join orderer to channel using osnadmin (Channel Participation API)
# ---------------------------------------------------------------------------
function joinOrdererToChannel() {
  infoln "Joining orderer to channel '${CHANNEL_NAME}' via Channel Participation API..."

  # Check if channel genesis block exists
  if [ ! -f "${FABRIC_ROOT}/channel-artifacts/${CHANNEL_NAME}.block" ]; then
    fatalln "Channel genesis block not found: ${FABRIC_ROOT}/channel-artifacts/${CHANNEL_NAME}.block"
  fi

  # Use osnadmin to join the orderer to the channel
  # osnadmin runs from the host (or a tools container) and connects to orderer admin port
  docker run --rm \
    --network kavach_fabric \
    -v "${FABRIC_ROOT}/channel-artifacts:/channel-artifacts" \
    -v "${ORDERER_TLS_DIR}:/orderer-tls" \
    hyperledger/fabric-tools:2.5 \
    osnadmin channel join \
      --channelID "${CHANNEL_NAME}" \
      --config-block /channel-artifacts/${CHANNEL_NAME}.block \
      -o orderer.kavach.example.com:7053 \
      --ca-file /orderer-tls/ca.crt \
      --client-cert /orderer-tls/server.crt \
      --client-key /orderer-tls/server.key

  verifyResult $? "Failed to join orderer to channel '${CHANNEL_NAME}'"
  successln "Orderer joined channel '${CHANNEL_NAME}'"
}

# ---------------------------------------------------------------------------
# Fetch the genesis block from orderer and join peer
# ---------------------------------------------------------------------------
function joinPeerToChannel() {
  infoln "Joining peer0.org1 to channel '${CHANNEL_NAME}'..."

  # Fetch the genesis block from orderer via CLI container
  docker exec cli peer channel fetch oldest \
    /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}_fetch.block \
    -o orderer.kavach.example.com:7050 \
    -c "${CHANNEL_NAME}" \
    --tls \
    --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem

  verifyResult $? "Failed to fetch channel genesis block"
  successln "Fetched channel genesis block from orderer"

  # Join peer to channel
  docker exec cli peer channel join \
    -b /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}_fetch.block

  verifyResult $? "Failed to join peer0.org1 to channel '${CHANNEL_NAME}'"
  successln "peer0.org1 joined channel '${CHANNEL_NAME}'"
}

# ---------------------------------------------------------------------------
# Set anchor peer
# ---------------------------------------------------------------------------
function setAnchorPeer() {
  infoln "Setting anchor peer for Org1 on channel '${CHANNEL_NAME}'..."

  # Fetch the current channel config
  docker exec cli peer channel fetch config \
    /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_block.pb \
    -o orderer.kavach.example.com:7050 \
    -c "${CHANNEL_NAME}" \
    --tls \
    --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem

  verifyResult $? "Failed to fetch channel config"

  # Decode, modify, and re-encode to set anchor peer
  docker exec cli bash -c '
    cd /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts

    # Decode the config block
    configtxlator proto_decode --input config_block.pb --type common.Block \
      | jq ".data.data[0].payload.data.config" > config.json

    # Check if anchor peer is already set
    EXISTING=$(jq -r ".channel_group.groups.Application.groups.Org1MSP.values.AnchorPeers // empty" config.json)
    if [ -n "$EXISTING" ] && [ "$EXISTING" != "null" ]; then
      echo "Anchor peer already set, skipping"
      exit 0
    fi

    # Add anchor peer
    jq ".channel_group.groups.Application.groups.Org1MSP.values += {\"AnchorPeers\":{\"mod_policy\": \"Admins\",\"value\":{\"anchor_peers\": [{\"host\": \"peer0.org1.kavach.example.com\",\"port\": 7051}]},\"version\": \"0\"}}" \
      config.json > modified_config.json

    # Compute the update
    configtxlator proto_encode --input config.json --type common.Config --output config.pb
    configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
    configtxlator compute_update --channel_id kavachdms-channel --original config.pb --updated modified_config.pb --output config_update.pb 2>&1 || {
      echo "No anchor peer update needed (config unchanged)"
      exit 0
    }

    # Wrap in envelope
    configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate \
      | jq "{\"payload\":{\"header\":{\"channel_header\":{\"channel_id\":\"kavachdms-channel\",\"type\":2}},\"data\":{\"config_update\":" . "}}}" \
      | jq . > config_update_in_envelope.json
    configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb
  '

  # Submit the anchor peer update (only if the envelope was created)
  docker exec cli bash -c '
    if [ -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_update_in_envelope.pb ]; then
      peer channel update \
        -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/config_update_in_envelope.pb \
        -c kavachdms-channel \
        -o orderer.kavach.example.com:7050 \
        --tls \
        --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem
    fi
  '

  successln "Anchor peer configuration complete"
}

# ---------------------------------------------------------------------------
# Verify channel
# ---------------------------------------------------------------------------
function verifyChannel() {
  infoln "Verifying channel membership..."

  local channels
  channels=$(docker exec cli peer channel list 2>&1)

  if echo "$channels" | grep -q "${CHANNEL_NAME}"; then
    successln "peer0.org1 is a member of '${CHANNEL_NAME}'"
  else
    errorln "Channel verification failed"
    echo "$channels"
    exit 1
  fi

  # Get channel info
  docker exec cli peer channel getinfo -c "${CHANNEL_NAME}"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
separator
infoln "KavachDMS Channel Setup"
separator

verifyNetwork
joinOrdererToChannel
sleep 2
joinPeerToChannel
setAnchorPeer
verifyChannel

separator
successln "Channel '${CHANNEL_NAME}' is ready!"
separator
echo ""
infoln "Channel:  ${CHANNEL_NAME}"
infoln "Peer:     peer0.org1.kavach.example.com"
infoln "Org:      Org1MSP"
echo ""
infoln "Next: Deploy chaincode with ./scripts/deploy-chaincode.sh"
