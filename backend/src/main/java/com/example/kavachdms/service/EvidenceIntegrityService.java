package com.example.kavachdms.service;

import com.example.kavachdms.blockchain.FabricGatewayService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class EvidenceIntegrityService {

    private final HashService hashService;
    private final FabricGatewayService fabricGatewayService;

    public EvidenceIntegrityService(
            HashService hashService,
            FabricGatewayService fabricGatewayService) {

        this.hashService = hashService;
        this.fabricGatewayService = fabricGatewayService;
    }

    public String calculateAndRecordHash(
            String evidenceId,
            InputStream inputStream,
            String eventType,
            String recordedBy) throws Exception {

        String hash = hashService.calculateSha256(inputStream);

        fabricGatewayService.recordEvidenceHash(
                evidenceId,
                hash,
                eventType,
                recordedBy
        );

        return hash;
    }

    public boolean verifyEvidence(
            String evidenceId,
            InputStream inputStream) throws Exception {

        String actualHash = hashService.calculateSha256(inputStream);

        return fabricGatewayService.verifyEvidenceHash(
                evidenceId,
                actualHash
        );
    }
}