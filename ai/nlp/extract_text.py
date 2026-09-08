import fitz

pdf_path = "sample.pdf"

doc = fitz.open(pdf_path)

with open("extracted_text.txt", "w", encoding="utf-8") as file:

    for page_number, page in enumerate(doc):
        text = page.get_text()

        file.write(f"\n--- PAGE {page_number + 1} ---\n")
        file.write(text)

doc.close()

print("Text extraction completed!")