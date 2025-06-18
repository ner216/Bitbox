
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Songs (
    song_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration_seconds INTEGER NOT NULL,
    audio_file_url TEXT NOT NULL UNIQUE,
    similar_song_id SERIAL REFERENCES Songs(song_id) ON DELETE CASCADE
);

CREATE INDEX idx_songs_title ON Songs (title);
CREATE INDEX idx_songs_artist ON Songs (artist);
CREATE INDEX idx_songs_genre ON Songs (genre);

CREATE TABLE Playlists (
    playlist_id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_playlists_user_id ON Playlists (user_id);

CREATE TABLE PlaylistSongs (
    playlist_song_id SERIAL PRIMARY KEY,
    playlist_id SERIAL NOT NULL REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
    song_id SERIAL NOT NULL REFERENCES Songs(song_id) ON DELETE CASCADE,
    UNIQUE (playlist_id, song_id)
);

CREATE INDEX idx_playlistsongs_song_id ON PlaylistSongs (song_id);
