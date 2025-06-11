import os
import numpy as np
import tensorflow as tf
import vggish_input
import vggish_params
import vggish_postprocess
import vggish_slim
import json


def extract_vggish_embedding(audio_path, sess, features_tensor, embedding_tensor, pproc):
    try:
        examples_batch = vggish_input.wavfile_to_examples(audio_path)
        [embedding_batch] = sess.run(
            [embedding_tensor],
            feed_dict={features_tensor: examples_batch}
        )
        postprocessed_batch = pproc.postprocess(embedding_batch)
        return np.mean(postprocessed_batch, axis=0).tolist()
    except Exception as e:
        print(f"Error extracting from {audio_path}: {e}")
        return None


def process_directory(audio_dir, output_json,
                      checkpoint_path='vggish_model.ckpt',
                      pca_params_path='vggish_pca_params.npz'):
    features = {}

    with tf.Graph().as_default(), tf.compat.v1.Session() as sess:
        vggish_slim.define_vggish_slim()
        vggish_slim.load_vggish_slim_checkpoint(sess, checkpoint_path)

        features_tensor = sess.graph.get_tensor_by_name(
            vggish_params.INPUT_TENSOR_NAME)
        embedding_tensor = sess.graph.get_tensor_by_name(
            vggish_params.OUTPUT_TENSOR_NAME)

        pproc = vggish_postprocess.Postprocessor(pca_params_path)

        for root, _, files in os.walk(audio_dir):
            for file in files:
                if file.lower().endswith(('.mp3')):
                    full_path = os.path.join(root, file)
                    print(f"Processing {full_path}")
                    embedding = extract_vggish_embedding(
                        full_path, sess, features_tensor, embedding_tensor, pproc)
                    if embedding:
                        features[file] = embedding

    with open(output_json, 'w') as f:
        json.dump(features, f, indent=2)
    print(f"Saved features to {output_json}")


def main():
    audio_dir = "test_audio"
    output_json = "vggish_vectors.json"
    process_directory(audio_dir, output_json)


if __name__ == "__main__":
    main()
