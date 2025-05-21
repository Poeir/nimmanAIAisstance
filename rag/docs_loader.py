from langchain.schema import Document
from utill import clean_unicode_spaces  # ฟังก์ชันนี้ช่วยจัดการเว้นวรรคพิเศษ
import pandas as pd

def load_documents_from_df(df):
    docs = []
    for _, row in df.iterrows():
        # ดึงข้อมูลจากแต่ละแถวแบบปลอดภัย
        name = str(row.get("displayName", "ไม่ระบุ"))
        address = str(row.get("formattedAddress", "ไม่ระบุ"))
        phone = str(row.get("internationalPhoneNumber", "ไม่ระบุ"))
        rating = str(row.get("rating", "ไม่มี"))
        rating_count = str(row.get("userRatingCount", "0"))
        types = str(row.get("types"))
        primaryTypes = str(row.get("primaryTypeDisplayName", "ไม่ระบุ"))
        opening_hours = clean_unicode_spaces(str(row.get("regularOpeningHours", "ไม่ระบุเวลาเปิด")))
        website = str(row.get("websiteUri", ""))
        id = str(row.get("id", ""))
        location_lat_long = str(row.get("location", "ไม่ระบุ"))
        editorialSummary = str(row.get("editorialSummary"))

        # เอาไปใส่ในเนื้อหา (page_content)
        page_content = (
            f"{name} Type {primaryTypes}"
            f"{editorialSummary}"
            f"Adress: {address} Phone: {phone} "
            f"{opening_hours} "
            f"Rating {rating} from {rating_count}"
            f"Website: {website if website else 'No website'} "
            f"Latiude and Longitude: {location_lat_long} "
        )

        # ใส่ metadata เพิ่มเติมไว้ช่วยกรองผล
        metadata = {
            "source": "csv",
            "id": id,
            "name": name,
            "types": types,
            "rating": row.get("rating", None),
            "userRatingCount": row.get("userRatingCount", 0),
            "goodForChildren": row.get("goodForChildren", None),
            "servesBeer": row.get("servesBeer", None),
            "servesWine": row.get("servesWine", None),
            "liveMusic": row.get("liveMusic", None),
            "outdoorSeating": row.get("outdoorSeating", None),
            "reservable": row.get("reservable", None),
            
        }

        docs.append(Document(page_content=page_content, metadata=metadata))
    
    return docs
