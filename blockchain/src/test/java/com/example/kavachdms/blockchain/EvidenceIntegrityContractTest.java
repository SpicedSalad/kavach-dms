package com.example.kavachdms.blockchain;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EvidenceIntegrityContractTest {

    @Test
    void recordAndRetrieveEvidenceHash() {
        Context context = mock(Context.class);
        ChaincodeStub stub = mock(ChaincodeStub.class);

        when(context.getStub()).thenReturn(stub);
        when(stub.getStringState("EVD-101")).thenReturn("");

        EvidenceIntegrityContract contract =
                new EvidenceIntegrityContract();

        contract.recordEvidenceHash(
                context,
                "EVD-101",
                "abc123hash",
                "EVIDENCE_REGISTERED",
                "officer@test.com"
        );

        verify(stub).putStringState(
                eq("EVD-101"),
                contains("abc123hash")
        );
    }

    @Test
    void verifyCorrectEvidenceHash() {
        Context context = mock(Context.class);
        ChaincodeStub stub = mock(ChaincodeStub.class);

        when(context.getStub()).thenReturn(stub);
        when(stub.getStringState("EVD-101"))
                .thenReturn("EVD-101|abc123hash|EVIDENCE_REGISTERED|officer@test.com|2026-09-11T00:00:00Z");

        EvidenceIntegrityContract contract =
                new EvidenceIntegrityContract();

        boolean result = contract.verifyEvidenceHash(
                context,
                "EVD-101",
                "abc123hash"
        );

        assertTrue(result);
    }

    @Test
    void rejectIncorrectEvidenceHash() {
        Context context = mock(Context.class);
        ChaincodeStub stub = mock(ChaincodeStub.class);

        when(context.getStub()).thenReturn(stub);
        when(stub.getStringState("EVD-101"))
                .thenReturn("EVD-101|abc123hash|EVIDENCE_REGISTERED|officer@test.com|2026-09-11T00:00:00Z");

        EvidenceIntegrityContract contract =
                new EvidenceIntegrityContract();

        boolean result = contract.verifyEvidenceHash(
                context,
                "EVD-101",
                "wronghash"
        );

        assertFalse(result);
    }
}