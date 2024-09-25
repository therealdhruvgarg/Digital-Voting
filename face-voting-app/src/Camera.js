import React, { useRef, useState, useEffect } from 'react';

const Camera = ({ handleCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Get access to the user's webcam
    async function startVideo() {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
        videoRef.current.srcObject = newStream;
      } catch (err) {
        console.error("Error accessing the webcam", err);
      }
    }

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    handleCapture(imageData);  // Send captured image data to parent component
  };

  return (
    <div>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        style={{ width: '50%', height: 'auto' }} 
      />
      <button onClick={captureImage}>Capture Image</button>
    </div>
  );
};

export default Camera;
