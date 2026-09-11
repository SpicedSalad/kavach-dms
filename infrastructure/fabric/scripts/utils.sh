#!/usr/bin/env bash
# Copyright KavachDMS Project. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# ---------------------------------------------------------------------------
# Utility functions for KavachDMS Fabric scripts
# ---------------------------------------------------------------------------

# Colors
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_BLUE='\033[0;34m'
C_CYAN='\033[0;36m'

function infoln() {
  echo -e "${C_CYAN}[INFO]${C_RESET} $*"
}

function successln() {
  echo -e "${C_GREEN}[SUCCESS]${C_RESET} $*"
}

function warnln() {
  echo -e "${C_YELLOW}[WARN]${C_RESET} $*"
}

function errorln() {
  echo -e "${C_RED}[ERROR]${C_RESET} $*"
}

function fatalln() {
  errorln "$@"
  exit 1
}

function separator() {
  echo "============================================================"
}

# Verify a command exited successfully, or print error and exit
function verifyResult() {
  if [ "$1" -ne 0 ]; then
    fatalln "$2"
  fi
}

# Get the directory where the calling script resides
function getScriptDir() {
  cd "$(dirname "$0")" && pwd
}

# Get the fabric root directory (parent of scripts/)
function getFabricRoot() {
  local script_dir
  script_dir="$(getScriptDir)"
  echo "$(cd "${script_dir}/.." && pwd)"
}

# Export common environment variables for Fabric CLI operations
function setGlobals() {
  local FABRIC_ROOT
  FABRIC_ROOT="$(getFabricRoot)"

  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID="Org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE="${FABRIC_ROOT}/organizations/peerOrganizations/org1.kavach.example.com/peers/peer0.org1.kavach.example.com/tls/ca.crt"
  export CORE_PEER_MSPCONFIGPATH="${FABRIC_ROOT}/organizations/peerOrganizations/org1.kavach.example.com/users/Admin@org1.kavach.example.com/msp"
  export CORE_PEER_ADDRESS=localhost:7051

  export ORDERER_CA="${FABRIC_ROOT}/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/msp/tlscacerts/tlsca.kavach.example.com-cert.pem"
  export ORDERER_ADMIN_TLS_SIGN_CERT="${FABRIC_ROOT}/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/tls/server.crt"
  export ORDERER_ADMIN_TLS_PRIVATE_KEY="${FABRIC_ROOT}/organizations/ordererOrganizations/kavach.example.com/orderers/orderer.kavach.example.com/tls/server.key"
}

# Check if Docker is available
function checkDocker() {
  if ! command -v docker &> /dev/null; then
    fatalln "Docker is not installed or not in PATH. Please install Docker."
  fi

  if ! docker info &> /dev/null; then
    fatalln "Docker daemon is not running. Please start Docker Desktop."
  fi

  if ! docker compose version &> /dev/null; then
    fatalln "Docker Compose is not available. Please install Docker Compose."
  fi

  infoln "Docker: $(docker --version)"
  infoln "Docker Compose: $(docker compose version --short)"
}
