from sklearn.neighbors import KNeighborsClassifier
import cv2
import numpy as np
import pickle
import os
import time
import csv
from datetime import datetime
from win32com.client import Dispatch

def speak(text):
    speak = Dispatch("SAPI.SpVoice")
    speak.Speak(text)

def record_vote(party, voter_name, date, timestamp, exist):
    if exist:
        with open("votes.csv", "a") as csvfile:
            writer = csv.writer(csvfile)
            attendance = [voter_name, party, date, timestamp]
            writer.writerow(attendance)
    else:
        with open("votes.csv", "a") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(COL_NAMES)
            attendance = [voter_name, party, date, timestamp]
            writer.writerow(attendance)

def check_if_exists(voter_name):
    try:
        with open('votes.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row and row[0] == voter_name:
                    return True
    except FileNotFoundError:
        print("File not found")
    return False

# Setup and loading data
video = cv2.VideoCapture(0)
facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if not os.path.exists('data/'):
    os.makedirs('data/')

with open('data/names.pkl', 'rb') as f:
    LABELS = pickle.load(f)
with open('data/face_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)
imgBackground = cv2.imread('background.png')

COL_NAMES = ['Name', 'Vote', 'Date', 'Time']

# Main loop for facial detection and voting
while True:
    ret, frame = video.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cropimg = frame[y:y+h, x:x+w]
        resized_img = cv2.resize(cropimg, (50, 50)).flatten().reshape(1, -1)
        output = knn.predict(resized_img)

        ts = time.time()
        date = datetime.fromtimestamp(ts).strftime('%d-%m-%y')
        timestamp = datetime.fromtimestamp(ts).strftime('%H:%M:%S')

        exist = os.path.isfile("votes.csv")

        # Draw the rectangle and name of voter
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 1)
        cv2.rectangle(frame, (x, y-40), (x+w, y), (50, 50, 255), -1)
        cv2.putText(frame, str(output[0]), (x, y-15), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 1)

        attendance = [output[0], timestamp]

    imgBackground = cv2.resize(imgBackground, (frame.shape[1], frame.shape[0]))
    imgBackground[:] = frame  # Assign entire frame to imgBackground
    cv2.imshow('frame', imgBackground)
    k = cv2.waitKey(1)

    # Check if voter has already voted
    voter_exist = check_if_exists(output[0])
    if voter_exist:
        speak("You have already voted")
        break

    # Voting options
    if k == ord('1'):
        speak("Your vote has been recorded")
        time.sleep(3)
        record_vote('BJP', output[0], date, timestamp, exist)
        speak("Thank you for voting")
        break

    if k == ord('2'):
        speak("Your vote has been recorded")
        time.sleep(3)
        record_vote('Congress', output[0], date, timestamp, exist)
        speak("Thank you for voting")
        break

    if k == ord('3'):
        speak("Your vote has been recorded")
        time.sleep(3)
        record_vote('AAP', output[0], date, timestamp, exist)
        speak("Thank you for voting")
        break

video.release()
cv2.destroyAllWindows()
