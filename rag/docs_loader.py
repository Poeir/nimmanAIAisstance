from langchain.schema import Document
from utill import clean_unicode_spaces
import pandas as pd

def load_documents_from_df(df):
    docs = []
    for _, row in df.iterrows():
        doc = Document(
            page_content=(
                "ชื่อร้าน " + row['name'] +
                " ที่อยู่ " + row['formatted_address'] +
                " เบอร์โทรศัพท์ " + row['international_phone_number'] +
                " เปิดเวลา " + clean_unicode_spaces(str(row['opening_hours'])) +
                " เรตติ้ง " + str(row['rating']) +
                " จากทั้งหมด " + str(row['user_ratings_total']) + " คนที่รีวิว" +
                " ประเภทร้าน " + row['types'] +
                " พิกัด ละติจูด " + str(row['lat']) +
                " ลองจิจูด " + str(row['lng'])
            ),
            metadata={"source": "csv", "id": str(row["url"])}
        )
        docs.append(doc)
    return docs
