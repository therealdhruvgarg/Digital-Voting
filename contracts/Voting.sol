pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;  // Tracks whether an address has voted
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // Ensure the voter hasn't voted before
        require(!voters[msg.sender], "You have already voted.");

        // Ensure the candidate is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        // Record that the voter has voted
        voters[msg.sender] = true;

        // Update candidate vote count
        candidates[_candidateId].voteCount++;
    }

    // Function to check if the user has voted
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }
}
