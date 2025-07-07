import os
import json
import numpy as np
import tensorflow as tf
from typing import Optional
from sklearn.metrics.pairwise import cosine_similarity

# Vggish imports
import vggish_scripts.vggish_input as  vggish_input
import vggish_scripts.vggish_params as vggish_params
import vggish_scripts.vggish_postprocess as vggish_postprocess
import vggish_scripts.vggish_slim as vggish_slim


# Get the directory where myscript.py is located
current_dir = os.path.dirname(__file__)
# Build the relative path to the YAML file
db_dir_path = os.path.join(current_dir, '..', 'audio-backend', 'app', 'db')
# Normalize the path
db_dir_path = os.path.abspath(db_dir_path)

# Temp paths
db_vector_file_path = os.path.join(current_dir, '..', 'audio-backend', 'app', 'db', 'vggish_vectors.json')


class logic_tools(object):
    def __init__(self):
        self.checkpoint_path = "models/vggish/vggish_model.ckpt"
        self.pca_params_path = "models/vggish/vggish_pca_params.npz"
        self.audio_dir = f"{db_dir_path}/music"


    # Used by get_most_similar_song()
    def load_vectors(self):   #reusable and safe to call from anywhere
        if not os.path.exists(db_vector_file_path):
            raise FileNotFoundError(f"Vector file not found at {db_vector_file_path}")
        with open(db_vector_file_path, "r") as f:
            return json.load(f)
        

    # Extract music file features from all files in the given directory
    def process_directory(self):
        features = {}

        with tf.Graph().as_default(), tf.compat.v1.Session() as sess:
            vggish_slim.define_vggish_slim()
            vggish_slim.load_vggish_slim_checkpoint(sess, self.checkpoint_path)

            features_tensor = sess.graph.get_tensor_by_name(vggish_params.INPUT_TENSOR_NAME)
            embedding_tensor = sess.graph.get_tensor_by_name(vggish_params.OUTPUT_TENSOR_NAME)

            pproc = vggish_postprocess.Postprocessor(self.pca_params_path)

            for root, _, files in os.walk(self.audio_dir):
                for file in files:
                    if file.lower().endswith(('.mp3')):
                        full_path = os.path.join(root, file)
                        print(f"Processing {full_path}")
                        embedding = self.extract_vggish_embedding(
                            full_path, sess, features_tensor, embedding_tensor, pproc)
                        if embedding:
                            features[file] = embedding

        with open(db_vector_file_path, 'w') as f:
            json.dump(features, f, indent=2)
        print(f"Saved features to {db_vector_file_path}")

    # Used by process_directory()
    def extract_vggish_embedding(self, audio_path, sess, features_tensor, embedding_tensor, pproc):
        try:
            examples_batch = vggish_input.wavfile_to_examples(audio_path)
            [embedding_batch] = sess.run(
                [embedding_tensor],
                feed_dict={features_tensor: examples_batch}
            )
            postprocessed_batch = pproc.postprocess(embedding_batch)
            return np.mean(postprocessed_batch, axis=0).tolist()
        except Exception as e:
            print(f"Error extracting from {audio_path} [logic_tools::extract_vggish_embedding]: {e}")
            return None
