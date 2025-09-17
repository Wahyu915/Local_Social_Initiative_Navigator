from db import engine, SessionLocal, Base
from models import NGO, Tag, NGOTag, Opportunity, WishlistItem, WishlistOffer

Base.metadata.create_all(engine)
db = SessionLocal()

# ---- Tags ----
tags = [
    ("environment", "Environment"),
    ("youth", "Youth"),
    ("education", "Education"),
    ("animal-welfare", "Animal Welfare"),
    ("community", "Community")
]
for key, name in tags:
    db.merge(Tag(key=key, name=name))
db.commit()

# ---- NGO sample ----
ng1 = NGO(
    name="Brunei Animal Care",
    short_desc="Rescue & adoption for strays.",
    website="https://example.org",
    city="Bandar Seri Begawan",
    district="Brunei-Muara",
    verified=True
)
db.add(ng1); db.flush()

db.add_all([
    NGOTag(ngo_id=ng1.id, tag_id=db.query(Tag).filter_by(key="animal-welfare").one().id),
    NGOTag(ngo_id=ng1.id, tag_id=db.query(Tag).filter_by(key="community").one().id),
])

# ---- Opportunity sample ----
db.add(Opportunity(
    ngo_id=ng1.id,
    title="Weekend Shelter Volunteer",
    description="Help clean cages and feed animals.",
    commitment="weekly",
    city="Bandar Seri Begawan",
    district="Brunei-Muara"
))

# ---- Wishlist samples ----
w1 = WishlistItem(
    ngo_id=ng1.id,
    title="Printer",
    description="Any reliable A4 printer",
    quantity=1,
    unit="unit",
    priority="high",
    status="open"
)
db.add(w1); db.flush()

db.add(WishlistItem(
    ngo_id=ng1.id,
    title="Laminating Machine",
    description="A4 size laminator",
    quantity=1,
    unit="unit",
    priority="normal",
    status="open"
))

db.add(WishlistOffer(
    wishlist_id=w1.id,
    donor_name="Test Donor",
    donor_email="donor@example.com",
    quantity=1,
    message="I can provide a used HP.",
    status="pending"
))

db.commit(); db.close()
print("✅ Database seeded (NGOs, opportunity, wishlist).")
