import re


# ============================================================
# GENERAL HELPERS
# ============================================================

def clean_value(value: str | None):
    """
    Clean a candidate extracted value.
    """

    if not value:
        return None

    value = value.strip()

    value = re.sub(
        r"\s+",
        " ",
        value
    )

    value = value.strip(
        " :;-.,"
    )

    if not value:
        return None

    return value


def make_field(
    value,
    confidence,
    page_number=None
):
    """
    Standard structure returned to the frontend/backend.
    """

    return {
        "value": value,
        "confidence": round(
            confidence,
            2
        ),
        "source_page": page_number
    }


def search_field(
    text,
    patterns
):
    """
    Search a page for a labelled field.

    Returns:
        value, confidence
    """

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE | re.MULTILINE
        )

        if match:

            value = clean_value(
                match.group(1)
            )

            if value:

                return value, 0.90

    return None, 0.0


def search_pages(
    pages,
    patterns
):
    """
    Search page-by-page.

    We keep the page number so the frontend/backend
    can know where an extracted value came from.
    """

    for page in pages:

        value, confidence = search_field(
            page["text"],
            patterns
        )

        if value:

            return make_field(
                value,
                confidence,
                page["page_number"]
            )

    return make_field(
        None,
        0.0,
        None
    )


def search_all_text(
    text,
    patterns
):
    """
    Fallback search over the combined text.
    """

    value, confidence = search_field(
        text,
        patterns
    )

    return make_field(
        value,
        confidence,
        None
    )


# ============================================================
# FIR NUMBER
# ============================================================

def extract_fir_number(
    text,
    pages
):

    # Prefer explicit FIR labels
    result = search_pages(
        pages,
        [
            r"FIR\s*(?:No|Number)\s*[:\-]?\s*([A-Z0-9\/\-]+)"
        ]
    )

    if result["value"]:
        return result

    return search_all_text(
        text,
        [
            r"FIR\s*(?:No|Number)\s*[:\-]?\s*([A-Z0-9\/\-]+)"
        ]
    )


# ============================================================
# DISTRICT
# ============================================================

def extract_district(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"District\s*[:\-]\s*([A-Za-z][A-Za-z .&'\-]+)"
        ]
    )


# ============================================================
# POLICE STATION
# ============================================================

def extract_police_station(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"P\.?\s*S\.?\s*[:\-]\s*([A-Za-z][A-Za-z .&'\-]+)",

            r"Police\s+Station\s*[:\-]\s*"
            r"([A-Za-z][A-Za-z .&'\-]+)"
        ]
    )


# ============================================================
# YEAR
# ============================================================

def extract_year(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"\bYear\s*[:\-]\s*(\d{4})"
        ]
    )


# ============================================================
# REGISTRATION DATE
# ============================================================

def extract_registration_date(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"(?:Date|Dated)\s*[:\-]\s*"
            r"(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})"
        ]
    )


# ============================================================
# OCCURRENCE DATE
# ============================================================

def extract_occurrence_date(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Occurrence\s+of\s+offence.*?"
            r"(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})",

            r"Date\s+of\s+Occurrence\s*[:\-]?\s*"
            r"(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})"
        ]
    )


# ============================================================
# OCCURRENCE TIME
# ============================================================

def extract_occurrence_time(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Occurrence\s+of\s+offence.*?"
            r"Time\s*[:\-]?\s*"
            r"(\d{1,2}[:.]\d{2}(?:\s*[APMapm]{2})?)",

            r"Time\s*Period\s*[:\-]?\s*"
            r"(\d{1,2}[:.]\d{2}(?:\s*[APMapm]{2})?)"
        ]
    )


# ============================================================
# PLACE OF OCCURRENCE
# ============================================================

def extract_place_of_occurrence(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Place\s+of\s+occurrence\s*[:\-]\s*(.+)",

            r"Place\s+of\s+Occurrence\s*[:\-]\s*(.+)"
        ]
    )


# ============================================================
# COMPLAINANT
# ============================================================

def extract_complainant(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Name\s*[:\-]\s*"
            r"([A-Z][A-Za-z .'\-]+)"
        ]
    )


# ============================================================
# COMPLAINANT FATHER / HUSBAND
# ============================================================

def extract_complainant_relative(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Father['’]s\/Husband['’]s\s+Name\s*[:\-]\s*"
            r"(.+)",

            r"Father['’]s\s+Name\s*[:\-]\s*(.+)"
        ]
    )


# ============================================================
# ACCUSED
# ============================================================

def extract_accused(
    text,
    pages
):

    for page in pages:

        page_text = page["text"]

        # Explicit accused name
        value, confidence = search_field(
            page_text,
            [
                r"Accused\s*1\s*"
                r"(?:Name)?\s*[:\-]\s*(.+)",

                r"Accused\s+1\s*"
                r"Name\s*[:\-]\s*(.+)"
            ]
        )

        if value:

            return [
                make_field(
                    value,
                    confidence,
                    page["page_number"]
                )
            ]

    return []


# ============================================================
# SECTIONS OF LAW
# ============================================================

def extract_sections(
    text,
    pages
):

    sections = []

    # --------------------------------------------
    # Search each page
    # --------------------------------------------

    for page in pages:

        page_text = page["text"]

        matches = re.findall(
            r"\b(?:IPC|CrPC|BNS|BNSS|TPID|IT Act)"
            r"\s*[\-]?\s*"
            r"\d+[A-Za-z]?(?:\s*(?:\/|,|&)\s*\d+[A-Za-z]?)*",
            page_text,
            re.IGNORECASE
        )

        for match in matches:

            value = clean_value(match)

            if value and value not in sections:

                sections.append(
                    {
                        "value": value,
                        "source_page": page["page_number"],
                        "confidence": 0.85
                    }
                )

    return sections


# ============================================================
# INVESTIGATING OFFICER
# ============================================================

def extract_investigating_officer(
    text,
    pages
):

    return search_pages(
        pages,
        [
            r"Investigating\s+Officer\s*[:\-]\s*(.+)",

            r"I\.?\s*O\.?\s*[:\-]\s*(.+)"
        ]
    )


# ============================================================
# FIR EXTRACTOR
# ============================================================

def extract_fir_metadata(
    text,
    pages
):

    return {

        "fir_number": extract_fir_number(
            text,
            pages
        ),

        "district": extract_district(
            text,
            pages
        ),

        "police_station": extract_police_station(
            text,
            pages
        ),

        "year": extract_year(
            text,
            pages
        ),

        "registration_date": extract_registration_date(
            text,
            pages
        ),

        "occurrence_date": extract_occurrence_date(
            text,
            pages
        ),

        "occurrence_time": extract_occurrence_time(
            text,
            pages
        ),

        "place_of_occurrence": extract_place_of_occurrence(
            text,
            pages
        ),

        "complainant_name": extract_complainant(
            text,
            pages
        ),

        "complainant_father_or_husband_name":
            extract_complainant_relative(
                text,
                pages
            ),

        "accused": extract_accused(
            text,
            pages
        ),

        "sections_of_law": extract_sections(
            text,
            pages
        ),

        "investigating_officer":
            extract_investigating_officer(
                text,
                pages
            )
    }


# ============================================================
# GENERIC EXTRACTORS FOR NOW
# ============================================================

def extract_generic_metadata(
    text,
    pages,
    document_type
):

    return {
        "document_type": document_type,

        "fields": {},

        "message": (
            "Document type identified. "
            "Detailed field extraction for this "
            "document type will be added next."
        )
    }


# ============================================================
# MAIN METADATA FUNCTION
# ============================================================

def extract_metadata(
    text,
    pages,
    document_type="UNKNOWN"
):

    if document_type == "FIR":

        return extract_fir_metadata(
            text,
            pages
        )

    return extract_generic_metadata(
        text,
        pages,
        document_type
    )