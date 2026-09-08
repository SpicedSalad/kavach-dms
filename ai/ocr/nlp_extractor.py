import spacy


# Load model once when the application starts
nlp = spacy.load(
    "en_core_web_sm"
)


def extract_entities(text: str) -> dict:
    """
    Extract general named entities using spaCy.
    """

    doc = nlp(text)

    entities = {
        "persons": [],
        "organizations": [],
        "locations": [],
        "dates": [],
        "other": []
    }

    for entity in doc.ents:

        value = entity.text.strip()

        if not value:
            continue

        if entity.label_ == "PERSON":

            if value not in entities["persons"]:
                entities["persons"].append(value)

        elif entity.label_ == "ORG":

            if value not in entities["organizations"]:
                entities["organizations"].append(value)

        elif entity.label_ in (
            "GPE",
            "LOC",
            "FAC"
        ):

            if value not in entities["locations"]:
                entities["locations"].append(value)

        elif entity.label_ in (
            "DATE",
            "TIME"
        ):

            if value not in entities["dates"]:
                entities["dates"].append(value)

        else:

            item = {
                "text": value,
                "label": entity.label_
            }

            if item not in entities["other"]:
                entities["other"].append(item)

    return entities