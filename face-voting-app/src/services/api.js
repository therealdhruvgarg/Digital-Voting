import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your Flask server URL

// Function to recognize a voter from an image
export const recognizeVoter = async (imageData) => {
  const response = await axios.post(`${API_URL}/recognize`, { image: imageData });
  return response.data.voterName; // Return the recognized voter's name
};

// Function to submit a vote
export const submitVote = async (voter, party) => {
  const response = await axios.post(`${API_URL}/vote`, { voter, party });
  return response.data.message; // Return success or error message
};

// Optional: Function to get the current voting status (if implemented in the backend)
export const getVotingStatus = async () => {
  const response = await axios.get(`${API_URL}/voting-status`);
  return response.data; // Assuming this returns some status information
};
