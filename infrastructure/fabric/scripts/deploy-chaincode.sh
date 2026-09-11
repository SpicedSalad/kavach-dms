#!/usr/bin/env bash
# Copyright KavachDMS Project. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# ---------------------------------------------------------------------------
# KavachDMS — Deploy EvidenceIntegrityContract Chaincode
# ---------------------------------------------------------------------------
# Deploys the existing Java chaincode from ../../blockchain/ to the
# KavachDMS Fabric network using the Fabric lifecycle.
#
# IMPORTANT: This script will gracefully fail with a clear message if
# the chaincode source code does not exist in ../../blockchain/.
# The Fabric network operates independently of chaincode deployment.
#
# Prerequisites:
#   1. Fabric network is running (./network.sh up)
#   2. Channel is created (./create-channel.sh)
#   3. Java chaincode exists in ../../blockchain/
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FABRIC_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${FABRIC_ROOT}/../.." && pwd)"

# shellcheck source=utils.sh
source "${SCRIPT_DIR}/utils.sh"

# Configuration
CHANNEL_NAME="kavachdms-channel"
CHAINCODE_NAME="evidenceintegrity"
CHAINCODE_VERSION="1.0"
CHAINCODE_SEQUENCE=1
CHAINCODE_SRC="${REPO_ROOT}/blockchain"
CHAINCODE_LABEL="${CHAINCODE_NAME}_${CHAINCODE_VERSION}"

# Paths inside CLI container
CLI_CHAINCODE_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode"
CLI_ORDERER_CA="/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem"

# ---------------------------------------------------------------------------
# Check if chaincode source exists
# ---------------------------------------------------------------------------
function checkChaincodeSource() {
  separator
  infoln "Checking for chaincode source in ${CHAINCODE_SRC}..."

  # Check if the blockchain directory has actual content (not just .gitkeep)
  local file_count
  file_count=$(find "${CHAINCODE_SRC}" -type f ! -name '.gitkeep' ! -name '.gitignore' 2>/dev/null | wc -l)

  if [ "$file_count" -eq 0 ]; then
    separator
    warnln "CHAINCODE NOT FOUND"
    separator
    echo ""
    echo "  The chaincode source directory does not contain the"
    echo "  EvidenceIntegrityContract yet."
    echo ""
    echo "  Location checked: ${CHAINCODE_SRC}"
    echo ""
    echo "  The Fabric network is running and the channel is ready."
    echo "  Chaincode deployment will work once the Java"
    echo "  EvidenceIntegrityContract is added to:"
    echo ""
    echo "    blockchain/"
    echo ""
    echo "  Expected structure:"
    echo "    blockchain/"
    echo "    ├── build.gradle  (or pom.xml)"
    echo "    └── src/"
    echo "        └── main/"
    echo "            └── java/"
    echo "                └── ...EvidenceIntegrityContract.java"
    echo ""
    echo "  After adding the chaincode, re-run:"
    echo "    ./scripts/deploy-chaincode.sh"
    echo ""
    separator
    infoln "Exiting gracefully. This is expected if chaincode is not yet written."
    exit 0
  fi

  # Check for Java project indicators
  if [ -f "${CHAINCODE_SRC}/build.gradle" ] || [ -f "${CHAINCODE_SRC}/pom.xml" ]; then
    successln "Java chaincode project found"
  else
    warnln "Chaincode files found but no build.gradle or pom.xml detected."
    warnln "Proceeding anyway — the chaincode packaging may need manual adjustment."
  fi
}

# ---------------------------------------------------------------------------
# Verify prerequisites
# ---------------------------------------------------------------------------
function verifyPrereqs() {
  # Check network is running
  if ! docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | grep -q "peer0"; then
    fatalln "Fabric network is not running. Run './network.sh up' first."
  fi

  # Check channel exists
  local channels
  channels=$(docker exec cli peer channel list 2>&1)
  if ! echo "$channels" | grep -q "${CHANNEL_NAME}"; then
    fatalln "Channel '${CHANNEL_NAME}' not found. Run './create-channel.sh' first."
  fi

  infoln "Network and channel verified"
}

# ---------------------------------------------------------------------------
# Package chaincode
# ---------------------------------------------------------------------------
function packageChaincode() {
  infoln "Packaging chaincode '${CHAINCODE_NAME}'..."

  # Mount the chaincode source into the CLI container and package it
  # For Java chaincode, we need to package the source directory

  # First, copy chaincode to a location accessible by CLI
  # We use docker cp to get chaincode into the CLI container
  docker cp "${CHAINCODE_SRC}/." cli:${CLI_CHAINCODE_PATH}/

  # Package using peer lifecycle
  docker exec cli peer lifecycle chaincode package \
    /opt/gopath/src/github.com/hyperledger/fabric/peer/${CHAINCODE_NAME}.tar.gz \
    --path ${CLI_CHAINCODE_PATH} \
    --lang java \
    --label "${CHAINCODE_LABEL}"

  verifyResult $? "Failed to package chaincode"
  successln "Chaincode packaged: ${CHAINCODE_LABEL}"
}

# ---------------------------------------------------------------------------
# Install chaincode on peer
# ---------------------------------------------------------------------------
function installChaincode() {
  infoln "Installing chaincode on peer0.org1..."

  docker exec cli peer lifecycle chaincode install \
    /opt/gopath/src/github.com/hyperledger/fabric/peer/${CHAINCODE_NAME}.tar.gz

  verifyResult $? "Failed to install chaincode"
  successln "Chaincode installed on peer0.org1"
}

# ---------------------------------------------------------------------------
# Get installed chaincode package ID
# ---------------------------------------------------------------------------
function getPackageId() {
  infoln "Querying installed chaincode package ID..."

  PACKAGE_ID=$(docker exec cli peer lifecycle chaincode queryinstalled \
    --output json | jq -r ".installed_chaincodes[] | select(.label==\"${CHAINCODE_LABEL}\") | .package_id")

  if [ -z "$PACKAGE_ID" ]; then
    fatalln "Could not find package ID for ${CHAINCODE_LABEL}"
  fi

  infoln "Package ID: ${PACKAGE_ID}"
}

# ---------------------------------------------------------------------------
# Approve chaincode for Org1
# ---------------------------------------------------------------------------
function approveChaincode() {
  infoln "Approving chaincode for Org1..."

  docker exec cli peer lifecycle chaincode approveformyorg \
    -o orderer.kavach.example.com:7050 \
    --channelID "${CHANNEL_NAME}" \
    --name "${CHAINCODE_NAME}" \
    --version "${CHAINCODE_VERSION}" \
    --package-id "${PACKAGE_ID}" \
    --sequence ${CHAINCODE_SEQUENCE} \
    --tls \
    --cafile "${CLI_ORDERER_CA}"

  verifyResult $? "Failed to approve chaincode for Org1"
  successln "Chaincode approved for Org1"
}

# ---------------------------------------------------------------------------
# Check commit readiness
# ---------------------------------------------------------------------------
function checkCommitReadiness() {
  infoln "Checking commit readiness..."

  docker exec cli peer lifecycle chaincode checkcommitreadiness \
    --channelID "${CHANNEL_NAME}" \
    --name "${CHAINCODE_NAME}" \
    --version "${CHAINCODE_VERSION}" \
    --sequence ${CHAINCODE_SEQUENCE} \
    --output json

  verifyResult $? "Commit readiness check failed"
}

# ---------------------------------------------------------------------------
# Commit chaincode definition
# ---------------------------------------------------------------------------
function commitChaincode() {
  infoln "Committing chaincode definition..."

  docker exec cli peer lifecycle chaincode commit \
    -o orderer.kavach.example.com:7050 \
    --channelID "${CHANNEL_NAME}" \
    --name "${CHAINCODE_NAME}" \
    --version "${CHAINCODE_VERSION}" \
    --sequence ${CHAINCODE_SEQUENCE} \
    --tls \
    --cafile "${CLI_ORDERER_CA}" \
    --peerAddresses peer0.org1.kavach.example.com:7051 \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org1.kavach.example.com/peers/peer0.org1.kavach.example.com/tls/ca.crt

  verifyResult $? "Failed to commit chaincode"
  successln "Chaincode committed to channel '${CHANNEL_NAME}'"
}

# ---------------------------------------------------------------------------
# Verify chaincode is committed
# ---------------------------------------------------------------------------
function verifyCommit() {
  infoln "Verifying chaincode commitment..."

  docker exec cli peer lifecycle chaincode querycommitted \
    --channelID "${CHANNEL_NAME}" \
    --name "${CHAINCODE_NAME}" \
    --output json

  verifyResult $? "Failed to verify chaincode commitment"
  successln "Chaincode '${CHAINCODE_NAME}' is committed and ready"
}

# ---------------------------------------------------------------------------
# Test chaincode invocation (proves contract is functional on the ledger)
# ---------------------------------------------------------------------------
function testChaincode() {
  separator
  infoln "Testing chaincode invocation..."
  separator

  # Attempt a test invoke — the exact function depends on the contract.
  # For EvidenceIntegrityContract, we try a basic invoke/query.
  # This proves the chaincode is deployed and executable.

  infoln "Attempting test invoke (CreateRecord)..."
  docker exec cli peer chaincode invoke \
    -o orderer.kavach.example.com:7050 \
    -C "${CHANNEL_NAME}" \
    -n "${CHAINCODE_NAME}" \
    -c '{"function":"CreateRecord","Args":["TEST001","sha256:abc123def456","test-user","DOCUMENT_UPLOAD","Test record for deployment verification"]}' \
    --tls \
    --cafile "${CLI_ORDERER_CA}" \
    --peerAddresses peer0.org1.kavach.example.com:7051 \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org1.kavach.example.com/peers/peer0.org1.kavach.example.com/tls/ca.crt \
    --waitForEvent \
    2>&1

  local invoke_result=$?

  if [ $invoke_result -eq 0 ]; then
    successln "Test invoke succeeded!"

    # Wait for the transaction to be committed
    sleep 2

    infoln "Attempting test query (ReadRecord)..."
    docker exec cli peer chaincode query \
      -C "${CHANNEL_NAME}" \
      -n "${CHAINCODE_NAME}" \
      -c '{"function":"ReadRecord","Args":["TEST001"]}' \
      2>&1

    if [ $? -eq 0 ]; then
      successln "Test query succeeded! Chaincode is fully functional."
    else
      warnln "Test query returned an error. The invoke may have used different function signatures."
      warnln "The chaincode IS deployed — verify function names match the actual contract."
    fi
  else
    warnln "Test invoke returned an error. This may be expected if:"
    warnln "  - The contract function names differ from the test"
    warnln "  - The contract requires different arguments"
    warnln ""
    warnln "The chaincode IS deployed and committed."
    warnln "Verify by checking: docker exec cli peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME}"
  fi
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
separator
infoln "KavachDMS Chaincode Deployment"
infoln "  Chaincode: ${CHAINCODE_NAME}"
infoln "  Version:   ${CHAINCODE_VERSION}"
infoln "  Channel:   ${CHANNEL_NAME}"
separator

checkChaincodeSource
verifyPrereqs
packageChaincode
installChaincode
getPackageId
approveChaincode
checkCommitReadiness
commitChaincode
verifyCommit
testChaincode

separator
successln "Chaincode deployment complete!"
separator
echo ""
infoln "Chaincode:  ${CHAINCODE_NAME}"
infoln "Version:    ${CHAINCODE_VERSION}"
infoln "Channel:    ${CHANNEL_NAME}"
infoln "Peer:       peer0.org1.kavach.example.com:7051"
echo ""
infoln "Next: Generate connection profile with ./scripts/generate-connection-profile.sh"
