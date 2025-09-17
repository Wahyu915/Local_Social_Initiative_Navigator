import re

TAG_SYNONYMS = {
    "environment": {"environment", "green", "cleanup", "trash", "tree", "sustainability"},
    "youth": {"youth", "kids", "children", "students", "teens"},
    "education": {"education", "teach", "tutor", "literacy", "school"},
    "animal-welfare": {"animal", "animals", "dogs", "cats", "stray", "rescue"},
    "health": {"health", "clinic", "medical", "hospital", "wellness"},
    "community": {"community", "neighbourhood", "neighborhood", "kampong", "village"}
}

CITIES = {"Bandar Seri Begawan", "Kuala Belait", "Seria", "Tutong", "Bangar"}
DISTRICTS = {"Brunei-Muara", "Belait", "Tutong", "Temburong"}

def parse_query(q: str):
    if not q:
        return {"tags": set(), "city": None, "district": None, "terms": []}
    qlow = q.lower()

    # tags via synonyms
    tags = set()
    for key, vocab in TAG_SYNONYMS.items():
        if any(word in qlow for word in vocab):
            tags.add(key)

    # city/district detection
    city = next((c for c in CITIES if c.lower() in qlow), None)
    district = next((d for d in DISTRICTS if d.lower() in qlow), None)

    # remaining terms
    terms = re.findall(r"[a-zA-Z]{3,}", qlow)
    return {"tags": tags, "city": city, "district": district, "terms": terms}

