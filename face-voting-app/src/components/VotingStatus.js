// src/components/VotingStatus.js
import React, { useEffect, useState } from 'react';
import { getVotingStatus } from '../services/api';

const VotingStatus = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchVotingStatus = async () => {
    try {
      const data = await getVotingStatus();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingStatus();
    const interval = setInterval(fetchVotingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Voting Status</h1>
      <table>
        <thead>
          <tr>
            <th>Party</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BJP</td>
            <td>{status.bjp || 0}</td>
          </tr>
          <tr>
            <td>Congress</td>
            <td>{status.congress || 0}</td>
          </tr>
          <tr>
            <td>AAP</td>
            <td>{status.aap || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VotingStatus;
