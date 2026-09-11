package com.example.kavachdms.blockchain;

import org.hyperledger.fabric.client.Contract;
import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.client.Network;
import org.hyperledger.fabric.client.identity.Identity;
import org.hyperledger.fabric.client.identity.Signer;
import org.hyperledger.fabric.client.identity.Identities;
import org.hyperledger.fabric.client.identity.Signers;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FabricGatewayService {

    private final FabricProperties fabricProperties;

    public FabricGatewayService(FabricProperties fabricProperties) {
        this.fabricProperties = fabricProperties;
    }

    private Gateway connect() throws Exception {

        if (fabricProperties.getCertificate() == null
                || fabricProperties.getCertificate().isBlank()
                || fabricProperties.getPrivateKey() == null
                || fabricProperties.getPrivateKey().isBlank()
                || fabricProperties.getMspId() == null
                || fabricProperties.getMspId().isBlank()) {

            throw new IllegalStateException(
                    "Fabric network configuration is not available");
        }

        Path certificatePath =
                Path.of(fabricProperties.getCertificate());

        Path privateKeyPath =
                Path.of(fabricProperties.getPrivateKey());

        Identity identity;

        try (var reader = Files.newBufferedReader(certificatePath)) {
            var certificate = Identities.readX509Certificate(reader);

            identity = new org.hyperledger.fabric.client.identity.X509Identity(
                    fabricProperties.getMspId(),
                    certificate
            );
        }

        Signer signer;

        try (var reader = Files.newBufferedReader(privateKeyPath)) {
            var privateKey = Identities.readPrivateKey(reader);
            signer = Signers.newPrivateKeySigner(privateKey);
        }

        return Gateway.newInstance()
                .identity(identity)
                .signer(signer)
                .connect();
    }

    public byte[] recordEvidenceHash(
            String evidenceId,
            String documentHash,
            String eventType,
            String recordedBy) throws Exception {

        try (Gateway gateway = connect()) {

            Network network =
                    gateway.getNetwork(fabricProperties.getChannel());

            Contract contract =
                    network.getContract(fabricProperties.getChaincode());

            return contract.submitTransaction(
                    "recordEvidenceHash",
                    evidenceId,
                    documentHash,
                    eventType,
                    recordedBy
            );
        }
    }

    public String getEvidenceHash(String evidenceId) throws Exception {

        try (Gateway gateway = connect()) {

            Network network =
                    gateway.getNetwork(fabricProperties.getChannel());

            Contract contract =
                    network.getContract(fabricProperties.getChaincode());

            byte[] result =
                    contract.evaluateTransaction(
                            "getEvidenceHash",
                            evidenceId
                    );

            return new String(result);
        }
    }

    public boolean verifyEvidenceHash(
            String evidenceId,
            String documentHash) throws Exception {

        try (Gateway gateway = connect()) {

            Network network =
                    gateway.getNetwork(fabricProperties.getChannel());

            Contract contract =
                    network.getContract(fabricProperties.getChaincode());

            byte[] result =
                    contract.evaluateTransaction(
                            "verifyEvidenceHash",
                            evidenceId,
                            documentHash
                    );

            return Boolean.parseBoolean(new String(result));
        }
    }
}