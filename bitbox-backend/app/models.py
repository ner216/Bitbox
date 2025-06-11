from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from .database import Base

playlist_songs = Table(
    "playlist_songs", Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.playlist_id"), primary_key=True),
    Column("song_id", Integer, ForeignKey("songs.song_id"), primary_key=True)
)

class Account(Base):
    __tablename__ = "accounts"
    account_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    playlists = relationship("Playlist", back_populates="owner")

class Playlist(Base):
    __tablename__ = "playlists"
    playlist_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.account_id"))
    owner = relationship("Account", back_populates="playlists")
    songs = relationship("Song", secondary=playlist_songs)

class Song(Base):
    __tablename__ = "songs"
    song_id = Column(Integer, primary_key=True)
    youtube_id = Column(String(50), unique=True, nullable=False)
    title = Column(Text, nullable=False)
    vector = Column(JSON)
