// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Candidate structure
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Store the candidates
    Candidate[] public candidates;

    // Track who has voted
    mapping(address => bool) public voters;

    // Address of the owner (who deployed the contract)
    address public owner;

    // Event to notify when a vote is cast
    event VoteCasted(address voter, string candidate);

    // Modifier to restrict some functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(string[] memory candidateNames) {
    require(candidateNames.length > 0, "Candidate names array is empty");
    owner = msg.sender;
    for (uint i = 0; i < candidateNames.length; i++) {
        candidates.push(Candidate({
            name: candidateNames[i],
            voteCount: 0
        }));
    }
}


    // Function to cast a vote for a candidate
    function vote(uint candidateIndex) public {
        require(!voters[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");

        // Mark the voter as having voted
        voters[msg.sender] = true;

        // Increase the vote count of the selected candidate
        candidates[candidateIndex].voteCount += 1;

        // Emit a voting event
        emit VoteCasted(msg.sender, candidates[candidateIndex].name);
    }

    // Function to get the number of candidates
    function getNumberOfCandidates() public view returns (uint) {
        return candidates.length;
    }

    // Function to get candidate details by index
    function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Invalid candidate index");
        return (candidates[index].name, candidates[index].voteCount);
    }

    // Function to get all candidate names (for the frontend)
    function getAllCandidates() public view returns (string[] memory) {
        string[] memory candidateNames = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }
}
