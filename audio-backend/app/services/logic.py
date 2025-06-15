import os
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

VECTORS_FILE = "audio-backend/scripts/vggish_vectors.json"

with open(VECTORS_FILE, "r") as f:
    all_vectors = json.load(f)

def get_most_similar_song(query_song):
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
