import React, { useState } from 'react';
import Camera from './Camera'; // Import the camera component
import { recognizeVoter, submitVote } from './services/api'; // API service functions

const App = () => {
  const [voterName, setVoterName] = useState(null); // State to hold the recognized voter's name
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  const handleCapture = async (imageData) => {
    const name = await recognizeVoter(imageData);
    if (name) {
      setVoterName(name); // Set the recognized voter's name
      setSuccessMessage(`Welcome, ${name}! Please cast your vote.`);
      setErrorMessage('');
    } else {
      setErrorMessage('Recognition failed. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleVote = async (party) => {
    if (!voterName) {
      setErrorMessage('No voter recognized. Please capture your face again.');
      return;
    }

    const message = await submitVote(voterName, party);
    if (message.includes('successfully')) {
      setSuccessMessage(message);
      setErrorMessage('');
    } else {
      setErrorMessage(message);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Voting System</h1>
      {!voterName ? (
        <Camera handleCapture={handleCapture} /> // Render Camera component if no voter recognized
      ) : (
        <div>
          <h2>{successMessage}</h2>
          <button onClick={() => handleVote('BJP')}>Vote for BJP</button>
          <button onClick={() => handleVote('Congress')}>Vote for Congress</button>
          <button onClick={() => handleVote('AAP')}>Vote for AAP</button>
        </div>
      )}
      {errorMessage && <h4 style={{ color: 'red' }}>{errorMessage}</h4>} {/* Display error messages */}
    </div>
  );
};

export default App;
