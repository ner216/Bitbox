import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from typing import Optional
import os
import json

class sound_tools(object):

    def get_most_similar_songs(self, query_song_url:str, top_results=5):
        # Get dictionary of song urls to their respected vector arrays
        song_embedding_dict = self.load_vectors()
        # Create a list of song urls from dictionary
        song_urls = list(song_embedding_dict.keys())
        # Fit a NearestNeighbors model
        # metric='cosine' uses 1 - cosine_similarity as distance
        # (smaller distance means higher similarity)
        embedding_matrix = np.array(list(song_embedding_dict.values()))
        nn_model = NearestNeighbors(n_neighbors=top_results + 1, metric='cosine', algorithm='brute')
        nn_model.fit(embedding_matrix)

        """
        Finds similar songs using a pre-trained NearestNeighbors model.
        """
        if query_song_url not in song_urls:
            print(f"Song '{query_song_url}' not found in embeddings.")
            return []

        query_embedding = np.array(song_embedding_dict[query_song_url]).reshape(1, -1)

        # distances will be 1 - cosine_similarity
        # indices will be the indices in embedding_matrix
        distances, indices = nn_model.kneighbors(query_embedding)

        similar_songs = []
        # Skip the first result as it's always the query song itself (distance 0)
        for i in range(1, len(indices[0])):
            index = indices[0][i]
            
            # Convert back to cosine similarity for better interpretation
            # Use this if similarity values are needed for debugging
            #distance = distances[0][i]
            #similarity = 1 - distance
            
            similar_song_url = song_urls[index]
            similar_songs.append(similar_song_url)
            if len(similar_songs) >= top_results:
                break
                
        return similar_songs


    # Used by get_most_similar_song()
    def load_vectors(self):   #reusable and safe to call from anywhere
        if not os.path.exists("app/db/vggish_vectors.json"):
            raise FileNotFoundError(f"Vector file not found at app/db/vggish_vectors.json")
        with open("app/db/vggish_vectors.json", "r") as f:
            return json.load(f)