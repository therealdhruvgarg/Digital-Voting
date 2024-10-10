import React, { useState, useEffect } from "react";
import web3 from "./web3";
import VotingContract from "./contracts/Voting.json";

const VotingComponent = () => {
  const [accounts, setAccounts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x25C6fEb1586A2cDa0347b624d9a69427F0D4C71C";  // Truffle Develop contract address
  const votingInstance = new web3.eth.Contract(VotingContract.abi, contractAddress);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        // Fetch the candidates count
        const candidatesCount = await votingInstance.methods.candidatesCount().call();
        const candidatesArray = [];

        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await votingInstance.methods.candidates(i).call();
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, []);

  const voteForCandidate = async () => {
    setLoading(true);
    try {
      await votingInstance.methods.vote(candidateId).send({ from: accounts[0] });
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
