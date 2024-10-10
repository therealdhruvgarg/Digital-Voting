// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Store candidates and votes
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store voters' information
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    // Event to trigger after a vote is cast
    event votedEvent(uint indexed candidateId);

    // Add candidate function
    // constructor() {
    //     addCandidate("Alice");
    //     addCandidate("Bob");
    // }

    // Function to add a candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function to cast a vote
    function vote(uint _candidateId) public {
        // Ensure the voter hasn't voted before
        require(!voters[msg.sender], "You have already voted!");

        // Ensure valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate!");

        // Record that voter has voted
        voters[msg.sender] = true;

        // Update vote count of candidate
        candidates[_candidateId].voteCount++;

        // Trigger voted event
        emit votedEvent(_candidateId);
    }
}
