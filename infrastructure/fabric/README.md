# KavachDMS — Hyperledger Fabric Development Infrastructure

## 1. Purpose

This directory contains the **minimal Hyperledger Fabric development network** for the KavachDMS project. Fabric provides the **tamper-evident ledger layer** for document integrity and chain-of-custody records.

**Fabric does NOT store actual documents.** Documents remain in MinIO/object storage. PostgreSQL remains the application database. Fabric records SHA-256 hashes, custody events, and integrity proofs.

```
Document → MinIO → SHA-256 hash → PostgreSQL metadata → Fabric integrity record
```

## 2. Architecture

Single-organization MVP development network:

```
┌─────────────────────────────────────────┐
│              KavachDMS Fabric           │
│                                         │
│   ┌───────────────────┐                 │
│   │   Orderer         │  EtcdRaft       │
│   │   (port 7050)     │  single node    │
│   └────────┬──────────┘                 │
│            │                            │
│   ┌────────┴──────────┐                 │
│   │   Org1            │                 │
│   │   ┌─────────────┐ │                 │
│   │   │  Peer0      │ │  LevelDB       │
│   │   │  (port 7051)│ │                 │
│   │   └─────────────┘ │                 │
│   │   ┌─────────────┐ │                 │
│   │   │  Fabric CA  │ │                 │
│   │   │  (port 7054)│ │                 │
│   │   └─────────────┘ │                 │
│   └───────────────────┘                 │
│                                         │
│   Channel: kavachdms-channel            │
│   Chaincode: evidenceintegrity          │
└─────────────────────────────────────────┘
         ▲
         │ Fabric Gateway (gRPC)
         │
┌────────┴──────────┐
│   Spring Boot     │
│   Backend         │
└───────────────────┘
```

### Components

| Component | Container | Image | Port | Purpose |
|-----------|-----------|-------|------|---------|
| Orderer | `orderer.kavach.example.com` | `fabric-orderer:2.5` | 7050 | EtcdRaft ordering service |
| Peer | `peer0.org1.kavach.example.com` | `fabric-peer:2.5` | 7051 | Endorsing/committing peer |
| CA | `ca.org1.kavach.example.com` | `fabric-ca:1.5` | 7054 | Certificate authority |
| CLI | `cli` | `fabric-tools:2.5` | — | Admin operations |

### Cryptogen vs. Fabric CA

| | cryptogen | Fabric CA |
|--|-----------|-----------|
| **Used for** | Initial crypto material generation | Runtime identity management |
| **When** | Network startup (`network.sh up`) | Production / advanced use cases |
| **Generates** | All certs/keys at once | Individual identities on demand |
| **Use case** | Development/testing convenience | Production identity lifecycle |

In this MVP, **cryptogen** generates all crypto material at startup. The **Fabric CA** container is included to:
- Demonstrate the CA component for SIH presentation
- Allow runtime identity enrollment if needed
- Provide a clear upgrade path to production

## 3. Prerequisites

- **Docker Desktop** with WSL2 integration
- **Ubuntu WSL** distribution with Docker CLI access
- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.0

### Verify Docker Access

All Fabric scripts run inside **Ubuntu WSL**. From PowerShell:

```powershell
# Verify Docker is accessible in WSL
wsl -d Ubuntu -- docker --version
wsl -d Ubuntu -- docker compose version
```

If Docker is not available in Ubuntu WSL, enable WSL integration in Docker Desktop:
**Docker Desktop → Settings → Resources → WSL Integration → Enable Ubuntu**

## 4. Directory Structure

```
infrastructure/fabric/
├── compose/
│   └── docker-compose.yaml         # Docker Compose for all Fabric containers
├── config/
│   ├── configtx.yaml               # Channel/orderer configuration (EtcdRaft)
│   ├── crypto-config-org1.yaml     # Org1 cryptogen config
│   └── crypto-config-orderer.yaml  # Orderer cryptogen config
├── scripts/
│   ├── network.sh                  # Network lifecycle (up/down/clean)
│   ├── create-channel.sh           # Channel creation and join
│   ├── deploy-chaincode.sh         # Chaincode deployment (graceful if missing)
│   ├── generate-connection-profile.sh  # Connection profile for Spring Boot
│   └── utils.sh                    # Shared utility functions
├── connection-profile/             # Generated connection profiles (gitignored)
├── organizations/                  # Generated crypto material (gitignored)
├── channel-artifacts/              # Generated genesis/channel blocks (gitignored)
├── .gitignore                      # Ignores generated crypto/artifacts
└── README.md                       # This file
```

## 5. How to Start Fabric

From PowerShell, enter WSL Ubuntu:

```powershell
wsl -d Ubuntu
```

Then navigate to the Fabric directory and start:

```bash
cd /mnt/y/Projects/SIH_2026/Project/kavach-dms/infrastructure/fabric

# Start the Fabric network
./scripts/network.sh up
```

This will:
1. Pull Fabric Docker images (first run only)
2. Generate crypto material using cryptogen
3. Generate the genesis block and channel transaction
4. Start all Docker containers (orderer, peer, CA, CLI)

**Note:** The network starts independently of chaincode. You do NOT need the Java chaincode to start the network.

## 6. How to Stop Fabric

```bash
# Stop and remove containers (preserves crypto material)
./scripts/network.sh down
```

## 7. How to Clean Fabric

```bash
# Full cleanup: containers, volumes, crypto, artifacts
./scripts/network.sh clean
```

This removes everything and allows a completely fresh start with `./scripts/network.sh up`.

## 8. How to Create/Use the Channel

After the network is running:

```bash
./scripts/create-channel.sh
```

This will:
1. Create channel `kavachdms-channel`
2. Join `peer0.org1` to the channel
3. Set the anchor peer for Org1
4. Verify channel membership

## 9. How to Deploy EvidenceIntegrityContract

```bash
./scripts/deploy-chaincode.sh
```

**If the chaincode does not yet exist** in `../../blockchain/`, the script will:
- Print a clear message explaining what's needed
- Exit gracefully (exit code 0)
- NOT fail or leave the network in a bad state

**When the chaincode exists**, the script will:
1. Package the Java chaincode
2. Install on peer0.org1
3. Approve for Org1
4. Commit the chaincode definition
5. **Verify by invoking and querying** the contract on the ledger

### Expected Chaincode Location

```
kavach-dms/
└── blockchain/
    ├── build.gradle  (or pom.xml)
    └── src/
        └── main/
            └── java/
                └── ...EvidenceIntegrityContract.java
```

## 10. Connection Profile

After the network is running:

```bash
./scripts/generate-connection-profile.sh
```

**Location:** `infrastructure/fabric/connection-profile/kavachdms-connection.json`

The connection profile contains:
- Peer, orderer, and CA endpoints
- Embedded TLS CA certificates
- Organization and MSP configuration

**This file is gitignored** because it contains embedded certificates generated at runtime.

## 11. MSP ID

| Organization | MSP ID |
|--------------|--------|
| Org1 (KavachDMS) | `Org1MSP` |
| Orderer | `OrdererMSP` |

## 12. Channel Name

```
kavachdms-channel
```

## 13. Chaincode Name

```
evidenceintegrity
```

## 14. Endpoints

| Service | Endpoint | Protocol |
|---------|----------|----------|
| Peer | `localhost:7051` | gRPCS (TLS) |
| Orderer | `localhost:7050` | gRPCS (TLS) |
| CA | `localhost:7054` | HTTPS (TLS) |
| Orderer Admin | `localhost:7053` | gRPCS (TLS) |

## 15. Spring Boot Backend Integration

The Spring Boot backend will connect via **Fabric Gateway** (gRPC).

### Required Configuration

The backend needs these items (all generated by the Fabric infrastructure):

| Item | Source |
|------|--------|
| Connection profile | `infrastructure/fabric/connection-profile/kavachdms-connection.json` |
| MSP ID | `Org1MSP` |
| Channel name | `kavachdms-channel` |
| Chaincode name | `evidenceintegrity` |
| User certificate | `infrastructure/fabric/organizations/peerOrganizations/org1.kavach.example.com/users/User1@org1.kavach.example.com/msp/signcerts/User1@org1.kavach.example.com-cert.pem` |
| User private key | `infrastructure/fabric/organizations/peerOrganizations/org1.kavach.example.com/users/User1@org1.kavach.example.com/msp/keystore/` (the `.pem` file in this directory) |
| Peer TLS CA cert | `infrastructure/fabric/organizations/peerOrganizations/org1.kavach.example.com/tlsca/tlsca.org1.kavach.example.com-cert.pem` |

### Spring Boot Properties (example)

```properties
# Fabric Gateway Configuration
fabric.network.connection-profile=${FABRIC_CONNECTION_PROFILE_PATH}
fabric.network.channel=kavachdms-channel
fabric.network.chaincode=evidenceintegrity
fabric.network.mspid=Org1MSP
fabric.network.user-cert=${FABRIC_USER_CERT_PATH}
fabric.network.user-key=${FABRIC_USER_KEY_PATH}
fabric.network.peer-endpoint=localhost:7051
fabric.network.tls-cert=${FABRIC_TLS_CERT_PATH}
```

### Connection Flow

```
Spring Boot → Fabric Gateway SDK → gRPC → Peer (7051)
                                          → EvidenceIntegrityContract
                                          → Ledger
```

## 16. Troubleshooting

### Docker not found in WSL

```bash
# Check if Docker CLI is available
docker --version

# If not, enable WSL integration in Docker Desktop:
# Docker Desktop → Settings → Resources → WSL Integration → Enable Ubuntu
```

### Containers won't start

```bash
# Check container logs
docker logs orderer.kavach.example.com
docker logs peer0.org1.kavach.example.com
docker logs ca.org1.kavach.example.com

# Check if ports are already in use
docker ps -a
netstat -tlnp | grep -E '7050|7051|7054'
```

### Channel creation fails

```bash
# Verify orderer is running
docker logs orderer.kavach.example.com --tail 20

# Verify genesis block exists
ls -la infrastructure/fabric/channel-artifacts/

# Try a clean restart
./scripts/network.sh clean
./scripts/network.sh up
./scripts/create-channel.sh
```

### Chaincode deployment fails

```bash
# Check if chaincode source exists
ls -la ../../blockchain/

# Check peer logs for chaincode errors
docker logs peer0.org1.kavach.example.com --tail 50

# Check if channel exists
docker exec cli peer channel list
```

### Network cleanup after errors

```bash
# Full cleanup and fresh start
./scripts/network.sh clean
./scripts/network.sh up
./scripts/create-channel.sh
```

### Permission errors on scripts

```bash
chmod +x scripts/*.sh
```

### WSL path for this directory

```bash
# From PowerShell
wsl -d Ubuntu -- bash -c "cd /mnt/y/Projects/SIH_2026/Project/kavach-dms/infrastructure/fabric && ls"
```
