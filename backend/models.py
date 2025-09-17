from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey, Date, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from db import Base

# -------- Core models --------

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    short_desc = Column(Text)
    full_desc = Column(Text)
    website = Column(Text)
    phone = Column(Text)
    email = Column(Text)
    city = Column(Text)
    district = Column(Text)
    latitude = Column(Text)
    longitude = Column(Text)
    verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    logo_url = Column(Text)

    tags = relationship("NGOTag", back_populates="ngo", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="ngo", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="ngo", cascade="all, delete-orphan")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    key = Column(Text, unique=True, nullable=False)
    name = Column(Text, nullable=False)

class NGOTag(Base):
    __tablename__ = "ngo_tags"
    ngo_id = Column(Integer, ForeignKey("ngos.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
    ngo = relationship("NGO", back_populates="tags")
    tag = relationship("Tag")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"))
    title = Column(Text, nullable=False)
    description = Column(Text)
    commitment = Column(Text)
    city = Column(Text)
    district = Column(Text)
    starts_on = Column(Date)
    ends_on = Column(Date)
    created_at = Column(TIMESTAMP, server_default=func.now())
    ngo = relationship("NGO", back_populates="opportunities")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    event_type = Column(Text, nullable=False)
    payload = Column(JSONB, nullable=False)  # fixed
    created_at = Column(TIMESTAMP, server_default=func.now())


# -------- Wishlist models --------

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(Integer, primary_key=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text)
    quantity = Column(Integer, default=1)
    unit = Column(Text)
    priority = Column(Text, default="normal")  # 'low' | 'normal' | 'high'
    needed_by = Column(Date)
    status = Column(Text, default="open")      # 'open' | 'reserved' | 'fulfilled' | 'cancelled'
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    ngo = relationship("NGO", back_populates="wishlist_items")
    offers = relationship("WishlistOffer", back_populates="wishlist_item", cascade="all, delete-orphan")

class WishlistOffer(Base):
    __tablename__ = "wishlist_offers"
    id = Column(Integer, primary_key=True)
    wishlist_id = Column(Integer, ForeignKey("wishlist_items.id"), nullable=False)
    donor_name = Column(Text, nullable=False)
    donor_email = Column(Text)
    quantity = Column(Integer, default=1)
    message = Column(Text)
    status = Column(Text, default="pending")   # 'pending' | 'accepted' | 'declined' | 'fulfilled'
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    wishlist_item = relationship("WishlistItem", back_populates="offers")
