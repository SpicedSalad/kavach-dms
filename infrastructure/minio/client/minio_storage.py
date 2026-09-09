import os

from dotenv import load_dotenv
from minio import Minio

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

    def upload(self, file_path, object_name):
        return self.client.fput_object(
            self.bucket,
            object_name,
            file_path,
        )

    def download(self, object_name, file_path):
        self.client.fget_object(
            self.bucket,
            object_name,
            file_path,
        )

    def delete(self, object_name):
        self.client.remove_object(
            self.bucket,
            object_name,
        )

    def exists(self, object_name):
        try:
            self.client.stat_object(self.bucket, object_name)
            return True
        except Exception:
            return False