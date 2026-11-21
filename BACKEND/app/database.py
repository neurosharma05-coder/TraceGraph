import os
from sqlalchemy import create_engine, Column, String, Float, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trace.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()

class CaseRecord(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True)
    metadata_json = Column(JSON)

class TimelineRecord(Base):
    __tablename__ = "timeline_events"
    id = Column(String, primary_key=True)
    case_id = Column(String, index=True)
    lat = Column(Float, default=0.0)
    lng = Column(Float, default=0.0)
    data_json = Column(JSON)

class GraphNodeRecord(Base):
    __tablename__ = "graph_nodes"
    id = Column(String, primary_key=True)
    case_id = Column(String, index=True)
    data_json = Column(JSON)

class GraphLinkRecord(Base):
    __tablename__ = "graph_links"
    id = Column(String, primary_key=True)
    case_id = Column(String, index=True)
    data_json = Column(JSON)

Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
