import React, { useState, useEffect } from "react";
import web3 from "../web3";
import Voting from "../contracts/Voting.json";

const VotingComponent = () => {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        const votingInstance = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Fetch candidates
        const candidatesCount = await votingInstance.methods.candidatesCount().call();
        let candidateList = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await votingInstance.methods.candidates(i).call();
          candidateList.push(candidate);
        }
        setCandidates(candidateList);

        // Check if user has already voted
        const hasVoted = await votingInstance.methods.voters(accounts[0]).call();
        setVoted(hasVoted);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, []);

  const voteForCandidate = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const votingInstance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address
      );
  
      if (!voted) {
        // Use legacy gas pricing (for non-EIP-1559 networks)
        const gasPrice = await web3.eth.getGasPrice();  // Get the current gas price
        
        await votingInstance.methods.vote(candidateId).send({
          from: account,
          gasPrice: gasPrice,  // Specify the legacy gas price here
        });
        
        alert("Vote cast successfully!");
        setVoted(true);  // Update state after voting
      } else {
        alert("You have already voted.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("There was an error while trying to cast your vote.");
    }
  };
  

  return (
    <div>
      <h1>Blockchain Voting DApp</h1>
      <p>Account: {account}</p>

      <h2>Candidates</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.id}. {candidate.name} - Votes: {candidate.voteCount}
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
      <button onClick={voteForCandidate} disabled={voted}>
        {voted ? "Already Voted" : "Vote"}
      </button>
    </div>
  );
};

export default VotingComponent;
