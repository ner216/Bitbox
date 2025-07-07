import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional
import os
import json

class sound_tools(object):
    # Find the most similar song to a given song
    def get_most_similar_song(self, query_song: str) -> Optional[str]:
        all_vectors = self.load_vectors()

        if query_song not in all_vectors:
            return None

        query_vec = np.array(all_vectors[query_song]).reshape(1, -1)
        best_match = None
        best_score = -1

        for song_name, vector in all_vectors.items():
            if song_name == query_song:
                continue
            candidate_vec = np.array(vector).reshape(1, -1)
            score = cosine_similarity(query_vec, candidate_vec)[0][0]
            if score > best_score:
                best_score = score
                best_match = song_name


        return best_match


    # Used by get_most_similar_song()
    def load_vectors(self):   #reusable and safe to call from anywhere
        if not os.path.exists("app/db/vggish_vectors.json"):
            raise FileNotFoundError(f"Vector file not found at app/db/vggish_vectors.json")
        with open("app/db/vggish_vectors.json", "r") as f:
            return json.load(f)