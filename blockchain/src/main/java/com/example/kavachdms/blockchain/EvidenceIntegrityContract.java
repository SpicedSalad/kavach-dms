package com.example.kavachdms.blockchain;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;

import java.time.Instant;

@Contract(name = "EvidenceIntegrityContract")
public class EvidenceIntegrityContract implements ContractInterface {

    @Transaction()
    public void recordEvidenceHash(
            Context ctx,
            String evidenceId,
            String documentHash,
            String eventType,
            String recordedBy) {

        ChaincodeStub stub = ctx.getStub();

        String existing = stub.getStringState(evidenceId);

        if (existing != null && !existing.isEmpty()) {
            throw new ChaincodeException(
                    "Evidence hash already exists: " + evidenceId);
        }

        String timestamp = Instant.now().toString();

        String record = String.join("|",
                evidenceId,
                documentHash,
                eventType,
                recordedBy,
                timestamp
        );

        stub.putStringState(evidenceId, record);
    }

    @Transaction()
    public String getEvidenceHash(
            Context ctx,
            String evidenceId) {

        ChaincodeStub stub = ctx.getStub();

        String record = stub.getStringState(evidenceId);

        if (record == null || record.isEmpty()) {
            throw new ChaincodeException(
                    "Evidence not found: " + evidenceId);
        }

        return record;
    }

    @Transaction()
    public boolean verifyEvidenceHash(
            Context ctx,
            String evidenceId,
            String documentHash) {

        ChaincodeStub stub = ctx.getStub();

        String record = stub.getStringState(evidenceId);

        if (record == null || record.isEmpty()) {
            throw new ChaincodeException(
                    "Evidence not found: " + evidenceId);
        }

        String[] fields = record.split("\\|");

        return fields.length >= 2 &&
                fields[1].equals(documentHash);
    }
}