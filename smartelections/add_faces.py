import cv2
import numpy as np
import pickle
import os

if not os.path.exists('data/'):
    os.makedirs('data/')

video = cv2.VideoCapture(0)
facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

face_data = []

i = 0

name = input("Enter your Aadhaar number: ")
framestotal = 51
captureAfterFrame = 2

while True:
    ret, frame = video.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        cropimg = frame[y:y+h, x:x+w]
        resized_img = cv2.resize(cropimg, (50, 50))
        if len(face_data) < framestotal and i % captureAfterFrame == 0: 
            face_data.append(resized_img)
        i += 1
        cv2.putText(frame, str(len(face_data)), (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 50, 255), 1)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 50, 255), 1)
    cv2.imshow('frame', frame)
    k = cv2.waitKey(1)
    if k == ord('q') or len(face_data) >= framestotal:
        break

video.release()
cv2.destroyAllWindows()

# Convert face data to NumPy array and reshape
face_data = np.asarray(face_data)
face_data = face_data.reshape((framestotal, -1))
print(len(face_data))

# Save Aadhaar number (name) to names.pkl
if 'names.pkl' not in os.listdir('data/'):
   names = [name] * framestotal
   with open('data/names.pkl', 'wb') as f:
         pickle.dump(names, f)
else:
    with open('data/names.pkl', 'rb') as f:
        names = pickle.load(f)
    names = names + [name] * framestotal
    with open('data/names.pkl', 'wb') as f:
        pickle.dump(names, f)

# Save face data to face_data.pkl
if 'face_data.pkl' not in os.listdir('data/'):
    with open('data/face_data.pkl', 'wb') as f:
        pickle.dump(face_data, f)
else:
    with open('data/face_data.pkl', 'rb') as f:
        faces = pickle.load(f)
    faces = np.append(faces, face_data, axis=0)
    with open('data/face_data.pkl', 'wb') as f:
        pickle.dump(faces, f)
