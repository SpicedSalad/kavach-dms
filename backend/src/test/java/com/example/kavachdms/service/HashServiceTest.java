package com.example.kavachdms.service;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class HashServiceTest {

    private final HashService hashService = new HashService();

    @Test
    void calculateSha256_shouldReturnSameHashForSameContent() throws Exception {
        String content = "KavachDMS evidence integrity";

        String hash1 = hashService.calculateSha256(
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8))
        );

        String hash2 = hashService.calculateSha256(
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8))
        );

        assertEquals(hash1, hash2);
        assertEquals(64, hash1.length());
    }

    @Test
    void verifySha256_shouldReturnTrueForMatchingHash() throws Exception {
        String content = "KavachDMS evidence integrity";

        ByteArrayInputStream input =
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));

        String actualHash = hashService.calculateSha256(input);

        ByteArrayInputStream verificationInput =
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));

        assertTrue(hashService.verifySha256(verificationInput, actualHash));
    }

    @Test
    void verifySha256_shouldReturnFalseForDifferentContent() throws Exception {
        String original = "KavachDMS evidence integrity";
        String modified = "KavachDMS modified evidence";

        ByteArrayInputStream originalInput =
                new ByteArrayInputStream(original.getBytes(StandardCharsets.UTF_8));

        String originalHash = hashService.calculateSha256(originalInput);

        ByteArrayInputStream modifiedInput =
                new ByteArrayInputStream(modified.getBytes(StandardCharsets.UTF_8));

        assertFalse(hashService.verifySha256(modifiedInput, originalHash));
    }

    @Test
    void verifySha256_shouldReturnFalseForNullHash() throws Exception {
        ByteArrayInputStream input =
                new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8));

        assertFalse(hashService.verifySha256(input, null));
    }
}