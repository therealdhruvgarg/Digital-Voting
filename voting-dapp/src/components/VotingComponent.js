import React, { useState, useEffect } from "react";
import web3 from "../web3";
import Voting from "../contracts/Voting.json";
import '../index.css'

const VotingComponent = () => {
  const [account, setAccount] = useState(null);
  const [candidateId, setCandidateId] = useState("");
  const [voted, setVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Voting.networks[networkId];
    const votingInstance = new web3.eth.Contract(
      Voting.abi,
      '0xa8a50bDd6c2cE89178A7DE4D81422Ce70E29FB77'
    );

    // Check if the user has already voted
    const hasVoted = await votingInstance.methods.hasVoted(accounts[0]).call();
    setVoted(hasVoted);

    // Load candidates
    const candidatesCount = await votingInstance.methods.candidatesCount().call();
    const loadedCandidates = [];
    let totalVotesCount = 0;

    for (let i = 1; i <= candidatesCount; i++) {
      const candidate = await votingInstance.methods.candidates(i).call();
      loadedCandidates.push(candidate);
      totalVotesCount += parseInt(candidate.voteCount); // Sum up the votes
    }

    setCandidates(loadedCandidates);
    setTotalVotes(totalVotesCount); // Set the total votes
  };

  const voteForCandidate = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const votingInstance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address
      );
  
      // Fetch current gas price (fallback for non-EIP-1559 networks)
      const gasPrice = await web3.eth.getGasPrice();
  
      let txParams = {
        from: account,
        to: deployedNetwork.address,
        data: votingInstance.methods.vote(candidateId).encodeABI(),
        gasPrice: gasPrice,  // Use legacy gas price
      };
  
      // Send transaction
      await web3.eth.sendTransaction(txParams);
  
      alert("Vote cast successfully!");
      setVoted(true);  // Block the vote button after voting
    } catch (error) {
      console.error("Error voting:", error);
      alert("There was an error while trying to cast your vote.");
    }
  };
  

  return (
    <div>
      <h1 className="text-2xl font-semibold  w-fit mt-3" >Blockchain Voting DApp</h1>
      <p className="text-lg pt-2 text-gray-600">Account: {account ? account : "Please connect MetaMask to vote"}</p>

      <h2 className="text-lg py-2 text-gray-800">Candidates</h2>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate.id}>
            {candidate.name} (Votes: {candidate.voteCount})
          </li>
        ))}
      </ul>

      {/* <h2>Total Votes Cast: {totalVotes}</h2> */}

      {account && (
        <>
          <h2 className="text-lg py-2 text-gray-600">Vote for a Candidate</h2>
          <input
            type="text"
            value={candidateId}
            onChange={e => setCandidateId(e.target.value)}
            placeholder="Enter Candidate ID"
            className="mr-5 border rounded-xl px-2 py-1 text-lg"
          />
          <button className="rounded-2xl py-1 px-3 uppercase font-semibold cursor-pointer tracking-wider text-gray-400 border-gray-400 md:border-2 ml-2 hover:bg-gray-400 hover:text-white transition ease-out duration-500" onClick={voteForCandidate} disabled={voted}>
            {voted ? "You have already voted" : "Vote"}
          </button>
        </>
      )}
    </div>
  );
};

export default VotingComponent;
