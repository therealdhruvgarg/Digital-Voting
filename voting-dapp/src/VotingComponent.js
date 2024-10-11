import React, { useState, useEffect } from "react";
import web3 from "./web3";
import VotingContract from "./contracts/Voting.json";

const VotingComponent = () => {
  const [accounts, setAccounts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x139Bc8d295C500D79a64Bbc80cBe68e1Fa72ef97";  // Make sure this matches your deployment
  const votingInstance = new web3.eth.Contract(VotingContract.abi, contractAddress);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        // Fetch the number of candidates
        const candidatesCount = await votingInstance.methods.candidatesCount().call();
        const candidatesArray = [];

        // Fetch all candidates
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await votingInstance.methods.candidates(i).call();
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        alert("Failed to load blockchain data. Make sure MetaMask is connected.");
      }
    };

    loadBlockchainData();
  }, []);

  const voteForCandidate = async () => {
    if (!candidateId || candidateId <= 0) {
      alert("Please enter a valid candidate ID");
      return;
    }
  
    setLoading(true);
    try {
      const gasPrice = await web3.eth.getGasPrice(); // Get current gas price from the network
      
      await votingInstance.methods.vote(candidateId).send({
        from: accounts[0],
        gasPrice: gasPrice // Explicitly specify gasPrice for legacy transactions
      });
  
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote.");
    }
    setLoading(false);
  };
  

  return (
    <div>
      <h1>Blockchain Voting DApp</h1>

      <h2>Candidates</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - Votes: {candidate.voteCount}
          </li>
        ))}
      </ul>

      <h2>Vote for a Candidate</h2>
      <input
        type="number"
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
        placeholder="Enter Candidate ID"
      />
      <button onClick={voteForCandidate} disabled={loading}>
        {loading ? "Voting..." : "Vote"}
      </button>
    </div>
  );
};

export default VotingComponent;
