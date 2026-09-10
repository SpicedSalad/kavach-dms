import hashlib
import shutil


def calculate_hash(file_path):
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while chunk := file.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()


# Original document
original = "sample.pdf"

# Create a copy
tampered = "tampered.pdf"
shutil.copy(original, tampered)

# Modify the copy
with open(tampered, "ab") as file:
    file.write(b"TAMPERED DATA")


# Calculate hashes
original_hash = calculate_hash(original)
current_hash = calculate_hash(tampered)

print("Original SHA-256:", original_hash)
print("Current SHA-256: ", current_hash)

if original_hash == current_hash:
    print("\nDOCUMENT INTEGRITY: VERIFIED")
else:
    print("\nDOCUMENT INTEGRITY: FAILED")
    print("TAMPER DETECTED!")