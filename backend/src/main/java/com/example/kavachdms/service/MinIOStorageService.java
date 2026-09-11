package com.example.kavachdms.service;
 
import io.minio.GetObjectArgs;

import io.minio.MinioClient;

import io.minio.PutObjectArgs;

import io.minio.RemoveObjectArgs;

import io.minio.StatObjectArgs;

import io.minio.StatObjectResponse;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
 
import java.io.InputStream;

import java.security.MessageDigest;
 
@Service

public class MinIOStorageService {
 
    private final MinioClient minioClient;

    private final String bucketName;
 
    public MinIOStorageService(

            MinioClient minioClient,

            @Value("${minio.bucket}") String bucketName) {
 
        this.minioClient = minioClient;

        this.bucketName = bucketName;

    }

    public String calculateSha256(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {

            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            StringBuilder hash = new StringBuilder();

            for (byte b : digest.digest()) {
                hash.append(String.format("%02x", b));
            }

            return hash.toString();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to calculate SHA-256 hash",
                    e
            );
        }
    }
 
    /**

     * Upload a file to MinIO.

     *

     * @param file the uploaded file

     * @param objectKey unique path/key inside the bucket

     * @return the object key

     */

    public String uploadFile(

            MultipartFile file,

            String objectKey) {
 
        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(

                    "File cannot be empty");

        }
 
        try (InputStream inputStream = file.getInputStream()) {
 
            PutObjectArgs args = PutObjectArgs.builder()

                    .bucket(bucketName)

                    .object(objectKey)

                    .stream(

                            inputStream,

                            file.getSize(),

                            -1

                    )

                    .contentType(

                            file.getContentType() != null

                                    ? file.getContentType()

                                    : "application/octet-stream"

                    )

                    .build();
 
            minioClient.putObject(args);
 
            return objectKey;
 
        } catch (Exception e) {
 
            throw new RuntimeException(

                    "Failed to upload file to MinIO",

                    e

            );

        }

    }
 
    /**

     * Download a file from MinIO.

     *

     * The caller is responsible for closing the returned stream.

     */

    public InputStream downloadFile(

            String objectKey) {
 
        try {
 
            GetObjectArgs args = GetObjectArgs.builder()

                    .bucket(bucketName)

                    .object(objectKey)

                    .build();
 
            return minioClient.getObject(args);
 
        } catch (Exception e) {
 
            throw new RuntimeException(

                    "Failed to download file from MinIO",

                    e

            );

        }

    }
 
    /**

     * Check whether an object exists.

     */

    public boolean fileExists(

            String objectKey) {
 
        try {
 
            StatObjectArgs args = StatObjectArgs.builder()

                    .bucket(bucketName)

                    .object(objectKey)

                    .build();
 
            minioClient.statObject(args);
 
            return true;
 
        } catch (Exception e) {
 
            return false;

        }

    }
 
    /**

     * Get metadata for an object.

     */

    public StatObjectResponse getFileMetadata(

            String objectKey) {
 
        try {
 
            StatObjectArgs args = StatObjectArgs.builder()

                    .bucket(bucketName)

                    .object(objectKey)

                    .build();
 
            return minioClient.statObject(args);
 
        } catch (Exception e) {
 
            throw new RuntimeException(

                    "Failed to retrieve file metadata from MinIO",

                    e

            );

        }

    }
 
    /**

     * Delete an object.

     */

    public void deleteFile(

            String objectKey) {
 
        try {
 
            RemoveObjectArgs args = RemoveObjectArgs.builder()

                    .bucket(bucketName)

                    .object(objectKey)

                    .build();
 
            minioClient.removeObject(args);
 
        } catch (Exception e) {
 
            throw new RuntimeException(

                    "Failed to delete file from MinIO",

                    e

            );

        }

    }

}