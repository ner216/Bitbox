
CREATE TABLE Users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE INDEX idx_users_email ON Users (email);

CREATE TABLE Songs (
    song_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    genre VARCHAR(100),
    duration_seconds INTEGER NOT NULL,
    release_year INTEGER,
    audio_file_url TEXT NOT NULL UNIQUE,
    cover_image_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_songs_title ON Songs (title);
CREATE INDEX idx_songs_artist ON Songs (artist);
CREATE INDEX idx_songs_genre ON Songs (genre);

CREATE TABLE Playlists (
    playlist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_playlists_user_id ON Playlists (user_id);

CREATE TABLE PlaylistSongs (
    playlist_song_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES Songs(song_id) ON DELETE CASCADE,
    song_order INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (playlist_id, song_id),
    UNIQUE (playlist_id, song_order)
);

CREATE INDEX idx_playlistsongs_song_id ON PlaylistSongs (song_id);
