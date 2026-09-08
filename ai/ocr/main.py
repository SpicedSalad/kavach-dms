from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

from .ocr import (
    extract_text_from_pdf,
    extract_text_from_image
)

from .classifier import (
    classify_document
)

from .metadata import (
    extract_metadata
)


app = FastAPI(
    title="Secure DMS AI Service",
    description=(
        "OCR and Document Intelligence "
        "service for the Secure Digital "
        "Document Management System"
    ),
    version="0.4.0"
)


ALLOWED_PDF_TYPES = {
    "application/pdf"
}

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg"
}


@app.get("/")
def home():

    return {
        "service": "Advaith AI Service",
        "status": "running",
        "version": "0.4.0"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/ai/process")
async def process_document(
    file: UploadFile = File(...)
):

    # ----------------------------------------
    # VALIDATE FILENAME
    # ----------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )

    # ----------------------------------------
    # VALIDATE FILE TYPE
    # ----------------------------------------

    content_type = (
        file.content_type or ""
    ).lower()

    filename = file.filename.lower()

    is_pdf = (
        content_type in ALLOWED_PDF_TYPES
        or filename.endswith(".pdf")
    )

    is_image = (
        content_type in ALLOWED_IMAGE_TYPES
        or filename.endswith(".png")
        or filename.endswith(".jpg")
        or filename.endswith(".jpeg")
    )

    if not is_pdf and not is_image:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Supported formats: PDF, PNG, JPG, JPEG"
            )
        )

    # ----------------------------------------
    # READ FILE
    # ----------------------------------------

    file_bytes = await file.read()

    if not file_bytes:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    # ----------------------------------------
    # OCR / TEXT EXTRACTION
    # ----------------------------------------

    try:

        if is_pdf:

            extraction = (
                extract_text_from_pdf(
                    file_bytes
                )
            )

        else:

            extraction = (
                extract_text_from_image(
                    file_bytes
                )
            )

        text = extraction["text"]

        pages = extraction["pages"]

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Document extraction failed: "
                f"{str(e)}"
            )
        )

    # ----------------------------------------
    # DOCUMENT CLASSIFICATION
    # ----------------------------------------

    try:

        classification = (
            classify_document(text)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Document classification failed: "
                f"{str(e)}"
            )
        )

    # ----------------------------------------
    # STRUCTURED METADATA
    # ----------------------------------------

    try:

        metadata = extract_metadata(
            text=text,
            pages=pages,
            document_type=(
                classification[
                    "document_type"
                ]
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Metadata extraction failed: "
                f"{str(e)}"
            )
        )

    # ----------------------------------------
    # FINAL RESPONSE
    # ----------------------------------------

    return {

        "filename": file.filename,

        "page_count": extraction[
            "page_count"
        ],

        "digital_pages": extraction[
            "digital_pages"
        ],

        "ocr_pages": extraction[
            "ocr_pages"
        ],

        "extraction_method": extraction[
            "extraction_method"
        ],

        "document_type": classification[
            "document_type"
        ],

        "classification_confidence": (
            classification[
                "confidence"
            ]
        ),

        "classification_scores": (
            classification[
                "scores"
            ]
        ),

        "metadata": metadata,

        # Keep the complete text because
        # this will be useful for RAG/search.
        "text": text
    }