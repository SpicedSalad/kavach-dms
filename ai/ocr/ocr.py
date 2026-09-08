import io
import re

import fitz
import pytesseract
from PIL import Image


def clean_text(text: str) -> str:
    """
    Clean OCR / extracted text while preserving paragraphs.
    """

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    lines = [line.strip() for line in text.split("\n")]

    cleaned_lines = []
    previous_blank = False

    for line in lines:

        if not line:
            if not previous_blank:
                cleaned_lines.append("")

            previous_blank = True

        else:
            cleaned_lines.append(line)
            previous_blank = False

    return "\n".join(cleaned_lines).strip()


def text_quality_score(text: str) -> float:
    """
    Estimate whether extracted PDF text is usable.

    This is deliberately simple.

    Real PDFs sometimes contain a broken / hidden text layer
    which technically contains text but is much worse than OCR.
    """

    if not text or not text.strip():
        return 0.0

    text = text.strip()

    # Remove whitespace for character analysis
    compact = re.sub(r"\s+", "", text)

    if len(compact) < 30:
        return 0.0

    # Count readable characters
    readable = sum(
        1
        for char in compact
        if char.isalnum() or char in ".,:;!?/-()[]%'\""
    )

    readable_ratio = readable / len(compact)

    # Excessive weird characters are usually a bad sign
    weird_ratio = 1.0 - readable_ratio

    score = readable_ratio

    if len(compact) > 100:
        score += 0.15

    if weird_ratio > 0.35:
        score -= 0.25

    return max(
        0.0,
        min(1.0, score)
    )


def ocr_page(page) -> str:
    """
    Render a PDF page and run Tesseract OCR.
    """

    pix = page.get_pixmap(
        matrix=fitz.Matrix(2, 2),
        alpha=False
    )

    image_bytes = pix.tobytes("png")

    image = Image.open(
        io.BytesIO(image_bytes)
    )

    text = pytesseract.image_to_string(
        image,
        config="--psm 6"
    )

    return clean_text(text)


def extract_text_from_pdf(file_bytes: bytes) -> dict:
    """
    Extract text from a PDF page by page.

    For every page:
        1. Try embedded/digital text.
        2. Measure quality.
        3. If poor, use OCR.

    This supports mixed PDFs.
    """

    pdf = fitz.open(
        stream=file_bytes,
        filetype="pdf"
    )

    pages = []

    digital_pages = 0
    ocr_pages = 0

    for page_number, page in enumerate(pdf):

        digital_text = clean_text(
            page.get_text("text")
        )

        digital_score = text_quality_score(
            digital_text
        )

        # Use digital text only when it looks usable
        if digital_score >= 0.65:

            text = digital_text
            method = "digital_text"

            digital_pages += 1

        else:

            text = ocr_page(page)
            method = "ocr"

            ocr_pages += 1

        pages.append(
            {
                "page_number": page_number + 1,
                "text": text,
                "method": method,
                "quality_score": round(
                    text_quality_score(text),
                    2
                )
            }
        )

    pdf.close()

    combined_parts = []

    for page in pages:

        combined_parts.append(
            f"\n--- PAGE {page['page_number']} ---\n"
        )

        combined_parts.append(
            page["text"]
        )

    final_text = clean_text(
        "\n".join(combined_parts)
    )

    if ocr_pages == 0:
        extraction_method = "digital_text"

    elif digital_pages == 0:
        extraction_method = "ocr"

    else:
        extraction_method = "mixed"

    return {
        "text": final_text,
        "pages": pages,
        "page_count": len(pages),
        "digital_pages": digital_pages,
        "ocr_pages": ocr_pages,
        "extraction_method": extraction_method
    }


def extract_text_from_image(file_bytes: bytes) -> dict:
    """
    Extract text from an image.
    """

    image = Image.open(
        io.BytesIO(file_bytes)
    )

    text = pytesseract.image_to_string(
        image,
        config="--psm 6"
    )

    text = clean_text(text)

    return {
        "text": text,

        "pages": [
            {
                "page_number": 1,
                "text": text,
                "method": "ocr",
                "quality_score": round(
                    text_quality_score(text),
                    2
                )
            }
        ],

        "page_count": 1,
        "digital_pages": 0,
        "ocr_pages": 1,
        "extraction_method": "ocr"
    }