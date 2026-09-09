import re


DOCUMENT_PATTERNS = {

    "FIR": [
        "first information report",
        "fir no",
        "fir number",
        "under section 154",
        "police station",
        "complainant / informant",
        "complainant",
        "acts & sections",
    ],

    "INVESTIGATION_RECORD": [
        "investigation report",
        "investigation record",
        "case diary",
        "investigation officer",
        "investigating officer",
        "action taken",
        "investigation",
    ],

    "WITNESS_STATEMENT": [
        "witness statement",
        "statement of witness",
        "statement under section 161",
        "statement under section 164",
        "deposition",
    ],

    "CHARGE_SHEET": [
        "charge sheet",
        "chargesheet",
        "final report",
        "accused persons",
        "prosecution witness",
        "list of witnesses",
        "list of accused",
    ],

    "COURT_FILING": [
        "before the hon'ble court",
        "before the honble court",
        "in the court of",
        "plaintiff",
        "defendant",
        "petitioner",
        "respondent",
        "petition",
    ],

    "EVIDENCE_RECORD": [
        "evidence record",
        "seizure memo",
        "seized property",
        "material object",
        "property seized",
        "seizure",
    ],

    "FORENSIC_REPORT": [
        "forensic report",
        "forensic examination",
        "forensic science laboratory",
        "fsl report",
        "laboratory examination",
        "forensic laboratory",
    ],

    "LEGAL_NOTICE": [
        "legal notice",
        "notice is hereby given",
        "hereby called upon",
        "notice to",
    ],

    "JUDGMENT": [
        "judgment",
        "judgement",
        "order pronounced",
        "court hereby orders",
        "convicted",
        "acquitted",
        "order of the court",
    ],
}


def normalize_text(text: str) -> str:

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def classify_document(text: str) -> dict:
    """
    Rule-based document classifier.

    The confidence is a relative score,
    NOT a true statistical probability.
    """

    normalized_text = normalize_text(text)

    scores = {}

    for document_type, patterns in DOCUMENT_PATTERNS.items():

        score = 0

        for pattern in patterns:

            if pattern in normalized_text:
                score += 1

        scores[document_type] = score

    best_type = max(
        scores,
        key=scores.get
    )

    best_score = scores[best_type]

    if best_score == 0:

        return {
            "document_type": "UNKNOWN",
            "confidence": 0.0,
            "scores": scores
        }

    total_score = sum(
        scores.values()
    )

    confidence = best_score / total_score

    return {
        "document_type": best_type,
        "confidence": round(
            confidence,
            2
        ),
        "scores": scores
    }