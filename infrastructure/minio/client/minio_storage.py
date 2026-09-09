import os

from dotenv import load_dotenv
from minio import Minio

import hashlib
import mimetypes

load_dotenv()


class MinIOStorage:
    def __init__(self):
        self.client = Minio(
            os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE", "false").lower() == "true",
        )

        self.bucket = os.getenv("MINIO_BUCKET", "documents")

    def upload_document(
        self,
        case_id: str,
        document_id: str,
        version: int,
        file_path: str,
        filename: str,
    ):
        storage_key = f"{case_id}/{document_id}/v{version}/{filename}"

        # Calculate SHA-256
        sha256 = hashlib.sha256()

        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                sha256.update(chunk)

        sha256_hash = sha256.hexdigest()

        # Detect content type
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"

        # Upload to MinIO
        result = self.client.fput_object(
            self.bucket,
            storage_key,
            file_path,
            content_type=content_type,
        )

        return {
            "storage_key": storage_key,
            "sha256_hash": sha256_hash,
            "size": os.path.getsize(file_path),
            "content_type": content_type,
        }

    def download_document(
        self,
        case_id: str,
        document_id: str,
        version: int,
        filename: str,
        output_path: str,
    ):
        object_name = f"{case_id}/{document_id}/v{version}/{filename}"

        self.client.fget_object(
            self.bucket,
            object_name,
            output_path,
        )

    def delete_document(
        self,
        case_id: str,
        document_id: str,
        version: int,
        filename: str,
    ):
        object_name = f"{case_id}/{document_id}/v{version}/{filename}"

        self.client.remove_object(
            self.bucket,
            object_name,
        )

    def document_exists(
        self,
        case_id: str,
        document_id: str,
        version: int,
        filename: str,
    ) -> bool:
        object_name = f"{case_id}/{document_id}/v{version}/{filename}"

        try:
            self.client.stat_object(self.bucket, object_name)
            return True
        except Exception:
            return False

    def verify_integrity(
        self,
        storage_key: str,
        expected_hash: str,
    ) -> bool:
        sha256 = hashlib.sha256()

        response = self.client.get_object(
            self.bucket,
            storage_key,
        )

        try:
            for chunk in response.stream(8192):
                sha256.update(chunk)
        finally:
            response.close()
            response.release_conn()

        actual_hash = sha256.hexdigest()

        return actual_hash == expected_hash