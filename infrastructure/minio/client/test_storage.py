import hashlib

from minio_storage import MinIOStorage


storage = MinIOStorage()

CASE_ID = "CASE-2026-0817"
DOCUMENT_ID = "DOC-001"
VERSION = 1
FILENAME = "FIR.pdf"

# 1. Create original file
with open("sample.pdf", "wb") as f:
    f.write(b"Original Kavach document")

# 2. Upload it
result = storage.upload_document(
    CASE_ID,
    DOCUMENT_ID,
    VERSION,
    "sample.pdf",
    FILENAME,
)

storage_key = result["storage_key"]
original_hash = result["sha256_hash"]

print("Original hash:", original_hash)

# 3. Verify original
verified = storage.verify_integrity(
    storage_key,
    original_hash,
)

print("Before tampering:", "VERIFIED" if verified else "TAMPERED")

# 4. Tamper with the local file
with open("sample.pdf", "ab") as f:
    f.write(b"TAMPERED")

# 5. Upload tampered file to the SAME storage key
storage.client.fput_object(
    storage.bucket,
    storage_key,
    "sample.pdf",
)

# 6. Verify against the ORIGINAL hash
verified = storage.verify_integrity(
    storage_key,
    original_hash,
)

print("After tampering:", "VERIFIED" if verified else "TAMPERED")