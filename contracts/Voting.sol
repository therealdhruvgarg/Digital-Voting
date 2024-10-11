pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;   // To store candidates
    mapping(address => bool) public voters;         // To track if an address has voted
    uint public candidatesCount;

    constructor() {
        // Add default candidates (can be done via a function too)
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // Check that the user has not voted before
        require(!voters[msg.sender], "You have already voted.");

        // Check for valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        // Record that this user has voted
        voters[msg.sender] = true;

        // Update the candidate's vote count
        candidates[_candidateId].voteCount++;
    }
}
