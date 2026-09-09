import json
import urllib.parse
import urllib.request


# ============================================================
# Configuration
# ============================================================

API_URL = "http://127.0.0.1:8000/search"
TOP_K = 5


# ============================================================
# Ground Truth
#
# A result is considered relevant when:
#   1. It comes from the expected document, AND
#   2. It contains the important concepts/terms for the query.
#
# We deliberately do NOT use page numbers because the printed
# page numbers inside the PDFs do not always match PyMuPDF's
# physical page numbers.
# ============================================================

evaluation_queries = [

    {
        "query": "What information must be recorded in the chain of custody?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["chain", "custody"],
                    ["date", "time"],
                    ["signature"]
                ]
            }
        ]
    },

    {
        "query": "How is authenticity and integrity of digital evidence maintained?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["digital", "evidence"],
                    ["integrity"],
                    ["authenticity"]
                ]
            }
        ]
    },

    {
        "query": "What details should be included when evidence is collected?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["evidence", "number"],
                    ["evidence", "description"],
                    ["location"]
                ]
            }
        ]
    },

    {
        "query": "How should a crime scene be preserved from contamination?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["contamination"],
                    ["clean", "gloves"],
                    ["preserve"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["contamination"],
                    ["preserve"]
                ]
            }
        ]
    },

    {
        "query": "What are the different crime scene search patterns?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["lane", "strip"],
                    ["grid"],
                    ["zone"],
                    ["spiral"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["strip"],
                    ["spiral"],
                    ["zone"],
                    ["grid"]
                ]
            }
        ]
    },

    {
        "query": "What is the grid method of searching a crime scene?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["grid", "method"],
                    ["horizontal"],
                    ["right", "angles"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["grid", "search"],
                    ["perpendicular"]
                ]
            }
        ]
    },

    {
        "query": "What is the spiral method of searching a crime scene?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["spiral", "method"],
                    ["focal", "point"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["spiral", "search"],
                    ["inward"],
                    ["outward"]
                ]
            }
        ]
    },

    {
        "query": "What should be documented when first arriving at a crime scene?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["document"],
                    ["scene"],
                    ["photograph"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["document"],
                    ["scene"]
                ]
            }
        ]
    },

    {
        "query": "How should physical evidence be recovered and packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["evidence"],
                    ["collected"],
                    ["packaging"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["evidence"],
                    ["package"],
                    ["container"]
                ]
            }
        ]
    },

    {
        "query": "How should evidence be transported and forwarded to the forensic laboratory?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["evidence"],
                    ["laboratory"],
                    ["transport"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["evidence"],
                    ["laboratory"],
                    ["transport"]
                ]
            }
        ]
    },

    {
        "query": "What checks should be made before sending evidence to the forensic laboratory?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["laboratory"],
                    ["seal"],
                    ["label"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["laboratory"],
                    ["seal"],
                    ["label"]
                ]
            }
        ]
    },

    {
        "query": "What are the goals of evidence packaging?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["packaging"],
                    ["damage"],
                    ["alteration"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["packaging"],
                    ["integrity"]
                ]
            }
        ]
    },

    {
        "query": "How should evidence be sealed?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["seal"],
                    ["evidence", "tape"],
                    ["initials"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["seal"],
                    ["evidence", "tape"]
                ]
            }
        ]
    },

    {
        "query": "What are the precautions for packaging evidence?",
        "relevant": [
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["package"],
                    ["damage"],
                    ["wet", "damp"]
                ]
            },
            {
                "document": "sample.pdf",
                "keywords": [
                    ["packaging"],
                    ["gloves"],
                    ["sealed"]
                ]
            }
        ]
    },

    {
        "query": "How should bloodstained clothing be packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["blood"],
                    ["clothing"],
                    ["package"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["blood"],
                    ["clothing"],
                    ["package"]
                ]
            }
        ]
    },

    {
        "query": "How should dried blood stains on solid objects be collected?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["blood"],
                    ["stain"],
                    ["solid"],
                    ["object"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["blood"],
                    ["stain"],
                    ["object"]
                ]
            }
        ]
    },

    {
        "query": "How should control samples be collected for blood evidence?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["control"],
                    ["sample"],
                    ["blood"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["control"],
                    ["sample"],
                    ["blood"]
                ]
            }
        ]
    },

    {
        "query": "How should semen stained clothing be packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["semen"],
                    ["clothing"],
                    ["package"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["semen"],
                    ["clothing"],
                    ["package"]
                ]
            }
        ]
    },

    {
        "query": "How should hair and fibres be collected and packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["hair"],
                    ["fibres"],
                    ["package"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["hair"],
                    ["fibers"],
                    ["package"]
                ]
            }
        ]
    },

    {
        "query": "How should questioned documents be preserved and packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["questioned"],
                    ["documents"],
                    ["preserve"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["questioned"],
                    ["documents"],
                    ["package"]
                ]
            }
        ]
    },

    {
        "query": "What precautions should be taken when handling documents containing latent fingerprints?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["fingerprint"],
                    ["gloves"],
                    ["contaminate"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["fingerprint"],
                    ["handling"],
                    ["print"]
                ]
            }
        ]
    },

    {
        "query": "How should drug evidence be packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["drug"],
                    ["packaging"],
                    ["pouch"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["drug"],
                    ["package"],
                    ["container"]
                ]
            }
        ]
    },

    {
        "query": "How should firearms be packaged for forensic examination?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["firearm"],
                    ["package"],
                    ["laboratory"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["firearm"],
                    ["package"],
                    ["weapon"]
                ]
            }
        ]
    },

    {
        "query": "How should recovered bullets be packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["bullet"],
                    ["package"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["bullet"],
                    ["package"]
                ]
            }
        ]
    },

    {
        "query": "How should glass fragments be packaged?",
        "relevant": [
            {
                "document": "sample.pdf",
                "keywords": [
                    ["glass"],
                    ["fragments"],
                    ["package"]
                ]
            },
            {
                "document": "Crime-Scene-Investigation.pdf",
                "keywords": [
                    ["glass"],
                    ["fragments"],
                    ["package"]
                ]
            }
        ]
    }
]


# ============================================================
# Search API
# ============================================================

def search_api(query):

    params = urllib.parse.urlencode({
        "query": query
    })

    url = f"{API_URL}?{params}"

    with urllib.request.urlopen(url) as response:

        return json.loads(
            response.read().decode()
        )


# ============================================================
# Relevance checking
# ============================================================

def keyword_group_matches(text, keyword_group):

    text = text.lower()

    return all(
        keyword.lower() in text
        for keyword in keyword_group
    )


def is_relevant(result, relevance_rules):

    document = result["document"]
    text = result["text"]

    for rule in relevance_rules:

        if document != rule["document"]:
            continue

        # At least one keyword group must match
        for keyword_group in rule["keywords"]:

            if keyword_group_matches(
                text,
                keyword_group
            ):
                return True

    return False


# ============================================================
# Metrics
# ============================================================

def calculate_metrics(results, relevance_rules):

    top_results = results[:TOP_K]

    relevant_count = sum(
        1
        for result in top_results
        if is_relevant(
            result,
            relevance_rules
        )
    )

    # Precision@5
    precision = relevant_count / TOP_K

    # Hit Rate@5
    hit_rate = (
        1.0
        if relevant_count > 0
        else 0.0
    )

    # MRR
    reciprocal_rank = 0.0
    first_relevant_rank = None

    for rank, result in enumerate(
        top_results,
        start=1
    ):

        if is_relevant(
            result,
            relevance_rules
        ):

            reciprocal_rank = 1.0 / rank

            first_relevant_rank = rank

            break

    return (
        precision,
        hit_rate,
        reciprocal_rank,
        first_relevant_rank
    )


# ============================================================
# Main evaluation
# ============================================================

def main():

    all_results = []

    print()
    print("========================================")
    print("AI-DMS SEARCH EVALUATION")
    print("========================================")
    print()

    for number, item in enumerate(
        evaluation_queries,
        start=1
    ):

        query = item["query"]

        print(
            f"[{number}/{len(evaluation_queries)}] "
            f"{query}"
        )

        try:

            response = search_api(query)

            results = response.get(
                "results",
                []
            )

            (
                precision,
                hit_rate,
                mrr,
                first_relevant_rank
            ) = calculate_metrics(
                results,
                item["relevant"]
            )

            all_results.append({

                "query_number": number,

                "query": query,

                "precision_at_5": precision,

                "hit_rate_at_5": hit_rate,

                "mrr": mrr,

                "first_relevant_rank":
                    first_relevant_rank
            })

            print(
                f"  Precision@5: "
                f"{precision:.2f}"
            )

            print(
                f"  Hit Rate@5:  "
                f"{hit_rate:.2f}"
            )

            print(
                f"  MRR:         "
                f"{mrr:.2f}"
            )

            print(
                f"  First relevant rank: "
                f"{first_relevant_rank}"
            )

            print()

        except Exception as e:

            print(
                f"  ERROR: {e}"
            )

            print()


    # ========================================================
    # Average metrics
    # ========================================================

    successful = len(all_results)

    if successful == 0:

        print(
            "No queries were successfully evaluated."
        )

        return


    average_precision = sum(
        item["precision_at_5"]
        for item in all_results
    ) / successful


    average_hit_rate = sum(
        item["hit_rate_at_5"]
        for item in all_results
    ) / successful


    mean_reciprocal_rank = sum(
        item["mrr"]
        for item in all_results
    ) / successful


    # ========================================================
    # Final report
    # ========================================================

    report = {

        "queries_evaluated":
            successful,

        "top_k":
            TOP_K,

        "average_precision_at_5":
            average_precision,

        "average_hit_rate_at_5":
            average_hit_rate,

        "mean_reciprocal_rank":
            mean_reciprocal_rank,

        "details":
            all_results
    }


    with open(
        "evaluation_report.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            report,
            file,
            indent=4
        )


    # ========================================================
    # Print final results
    # ========================================================

    print("========================================")
    print("FINAL RESULTS")
    print("========================================")

    print(
        f"Queries evaluated: "
        f"{successful}"
    )

    print(
        f"Average Precision@5: "
        f"{average_precision:.4f}"
    )

    print(
        f"Average Hit Rate@5: "
        f"{average_hit_rate:.4f}"
    )

    print(
        f"Mean Reciprocal Rank: "
        f"{mean_reciprocal_rank:.4f}"
    )

    print()

    print(
        "Report saved to evaluation_report.json"
    )


# ============================================================
# Entry point
# ============================================================

if __name__ == "__main__":
    main()