const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  const candidateNames = ['Alice', 'Bob', 'Charlie']; // Example candidate names
  deployer.deploy(Voting, candidateNames);
};
