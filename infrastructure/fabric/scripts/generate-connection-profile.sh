#!/usr/bin/env bash
# Copyright KavachDMS Project. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# ---------------------------------------------------------------------------
# KavachDMS — Generate Connection Profile
# ---------------------------------------------------------------------------
# Generates a connection profile JSON file for the Spring Boot backend
# to connect to the Fabric network via Fabric Gateway.
#
# Output: connection-profile/kavachdms-connection.json
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FABRIC_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=utils.sh
source "${SCRIPT_DIR}/utils.sh"

OUTPUT_DIR="${FABRIC_ROOT}/connection-profile"
OUTPUT_FILE="${OUTPUT_DIR}/kavachdms-connection.json"

# ---------------------------------------------------------------------------
# Verify network is running
# ---------------------------------------------------------------------------
function verifyNetwork() {
  if ! docker ps --filter "label=project=kavach-fabric" --format "{{.Names}}" | grep -q "peer0"; then
    fatalln "Fabric network is not running. Run './network.sh up' first."
  fi
}

# ---------------------------------------------------------------------------
# Generate connection profile
# ---------------------------------------------------------------------------
function generateProfile() {
  infoln "Generating connection profile..."

  mkdir -p "${OUTPUT_DIR}"

  # Read TLS CA certificates and encode for embedding in JSON
  local PEER_TLS_CA_JSON
  local ORDERER_TLS_CA_JSON

  PEER_TLS_CA_JSON=$(docker exec cli jq -Rs . /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/org1.kavach.example.com/tlsca/tlsca.org1.kavach.example.com-cert.pem 2>/dev/null)
  ORDERER_TLS_CA_JSON=$(docker exec cli jq -Rs . /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/kavach.example.com/tlsca/tlsca.kavach.example.com-cert.pem 2>/dev/null)

  if [ -z "$PEER_TLS_CA_JSON" ] || [ -z "$ORDERER_TLS_CA_JSON" ] || [ "$PEER_TLS_CA_JSON" = "null" ] || [ "$ORDERER_TLS_CA_JSON" = "null" ]; then
    fatalln "TLS CA certificates not found. Has the network been started with './network.sh up'?"
  fi

  # Generate the connection profile JSON
  cat > "${OUTPUT_FILE}" << CONN_PROFILE_EOF
{
  "name": "kavachdms-fabric-network",
  "version": "1.0.0",
  "client": {
    "organization": "Org1",
    "connection": {
      "timeout": {
        "peer": {
          "endorser": "300"
        }
      }
    }
  },
  "organizations": {
    "Org1": {
      "mspid": "Org1MSP",
      "peers": [
        "peer0.org1.kavach.example.com"
      ],
      "certificateAuthorities": [
        "ca.org1.kavach.example.com"
      ]
    }
  },
  "peers": {
    "peer0.org1.kavach.example.com": {
      "url": "grpcs://localhost:7051",
      "tlsCACerts": {
        "pem": ${PEER_TLS_CA_JSON}
      },
      "grpcOptions": {
        "ssl-target-name-override": "peer0.org1.kavach.example.com",
        "hostnameOverride": "peer0.org1.kavach.example.com"
      }
    }
  },
  "orderers": {
    "orderer.kavach.example.com": {
      "url": "grpcs://localhost:7050",
      "tlsCACerts": {
        "pem": ${ORDERER_TLS_CA_JSON}
      },
      "grpcOptions": {
        "ssl-target-name-override": "orderer.kavach.example.com",
        "hostnameOverride": "orderer.kavach.example.com"
      }
    }
  },
  "certificateAuthorities": {
    "ca.org1.kavach.example.com": {
      "url": "https://localhost:7054",
      "caName": "ca-org1",
      "tlsCACerts": {
        "pem": ${PEER_TLS_CA_JSON}
      },
      "httpOptions": {
        "verify": false
      }
    }
  },
  "channels": {
    "kavachdms-channel": {
      "orderers": [
        "orderer.kavach.example.com"
      ],
      "peers": {
        "peer0.org1.kavach.example.com": {
          "endorsingPeer": true,
          "chaincodeQuery": true,
          "ledgerQuery": true,
          "eventSource": true
        }
      }
    }
  }
}
CONN_PROFILE_EOF

  successln "Connection profile generated: ${OUTPUT_FILE}"
}

# ---------------------------------------------------------------------------
# Print backend integration info
# ---------------------------------------------------------------------------
function printIntegrationInfo() {
  local CERT_PATH="${FABRIC_ROOT}/organizations/peerOrganizations/org1.kavach.example.com/users/User1@org1.kavach.example.com/msp/signcerts/User1@org1.kavach.example.com-cert.pem"
  local KEY_DIR="${FABRIC_ROOT}/organizations/peerOrganizations/org1.kavach.example.com/users/User1@org1.kavach.example.com/msp/keystore"

  echo ""
  separator
  infoln "Spring Boot Integration Information"
  separator
  echo ""
  echo "  Connection Profile:"
  echo "    ${OUTPUT_FILE}"
  echo ""
  echo "  MSP ID:"
  echo "    Org1MSP"
  echo ""
  echo "  Channel Name:"
  echo "    kavachdms-channel"
  echo ""
  echo "  Chaincode Name:"
  echo "    evidenceintegrity"
  echo ""
  echo "  Peer Endpoint:"
  echo "    grpcs://localhost:7051"
  echo ""
  echo "  Orderer Endpoint:"
  echo "    grpcs://localhost:7050"
  echo ""
  echo "  CA Endpoint:"
  echo "    https://localhost:7054"
  echo ""
  echo "  User Certificate (for Fabric Gateway):"
  echo "    ${CERT_PATH}"
  echo ""
  echo "  User Private Key (for Fabric Gateway):"
  echo "    ${KEY_DIR}/"
  echo "    (Use the single .pem file in this directory)"
  echo ""
  echo "  Peer TLS CA Certificate:"
  echo "    ${FABRIC_ROOT}/organizations/peerOrganizations/org1.kavach.example.com/tlsca/tlsca.org1.kavach.example.com-cert.pem"
  echo ""
  separator
  infoln "For Spring Boot application.properties:"
  separator
  echo ""
  echo "  # Fabric Gateway Configuration"
  echo "  fabric.network.connection-profile=\${FABRIC_CONNECTION_PROFILE_PATH}"
  echo "  fabric.network.channel=kavachdms-channel"
  echo "  fabric.network.chaincode=evidenceintegrity"
  echo "  fabric.network.mspid=Org1MSP"
  echo "  fabric.network.user-cert=\${FABRIC_USER_CERT_PATH}"
  echo "  fabric.network.user-key=\${FABRIC_USER_KEY_PATH}"
  echo "  fabric.network.peer-endpoint=localhost:7051"
  echo "  fabric.network.tls-cert=\${FABRIC_TLS_CERT_PATH}"
  echo ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
separator
infoln "KavachDMS Connection Profile Generator"
separator

verifyNetwork
generateProfile
printIntegrationInfo
