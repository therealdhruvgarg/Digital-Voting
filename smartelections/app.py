from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import base64
import cv2
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pickle
import os
import csv
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load face data and model
try:
    with open('data/names.pkl', 'rb') as f:
        LABELS = pickle.load(f)
    with open('data/face_data.pkl', 'rb') as f:
        FACES = pickle.load(f)
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(FACES, LABELS)
except Exception as e:
    logging.error("Error loading model or labels: %s", e)

def decode_image(image_data):
    try:
        img_data = base64.b64decode(image_data.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        logging.error("Error decoding image: %s", e)
        return None

@app.route('/recognize', methods=['POST'])
def recognize_face():
    try:
        image_data = request.json['image']
        img = decode_image(image_data)

        if img is None:
            return jsonify({"error": "Invalid image data"}), 400

        resized_img = cv2.resize(img, (50, 50)).flatten().reshape(1, -1)
        voter_name = knn.predict(resized_img)[0]

        return jsonify({"voterName": voter_name})
    except Exception as e:
        logging.error("Error in recognize_face: %s", e)
        return jsonify({"error": "Failed to recognize face"}), 500

@app.route('/vote', methods=['POST'])
def record_vote():
    try:
        voter = request.json['voter']
        party = request.json['party']

        ts = datetime.now()
        date = ts.strftime('%d-%m-%y')
        timestamp = ts.strftime('%H:%M:%S')

        vote_exists = False
        if os.path.exists('votes.csv'):
            with open('votes.csv', 'r') as f:
                reader = csv.reader(f)
                for row in reader:
                    if row[0] == voter:
                        vote_exists = True
                        break

        if not vote_exists:
            with open('votes.csv', 'a') as f:
                writer = csv.writer(f)
                writer.writerow([voter, party, date, timestamp])

            return jsonify({"message": "Vote recorded successfully"}), 200
        else:
            return jsonify({"message": "You have already voted"}), 400
    except Exception as e:
        logging.error("Error in record_vote: %s", e)
        return jsonify({"error": "Failed to record vote"}), 500

if __name__ == '__main__':
    app.run(debug=True)
