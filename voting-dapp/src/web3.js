import Web3 from "web3";

let web3;

const loadWeb3 = async () => {
  if (window.ethereum) {
    // Modern dapp browsers
    web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("MetaMask connected.");
    } catch (error) {
      console.error("User denied MetaMask access:", error);
    }

    // Listen for account changes in MetaMask
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log('Account changed:', accounts[0]);
      window.location.reload();  // Reload the page to refresh the active account
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('Network changed to:', chainId);
      window.location.reload();  // Reload when the network changes
    });
  } else if (window.web3) {
    // Legacy dapp browsers
    web3 = new Web3(window.web3.currentProvider);
    console.log("Legacy web3 provider detected.");
  } else {
    // Non-Ethereum browser
    console.error("Non-Ethereum browser detected. Please install MetaMask.");
  }
};

loadWeb3();

export default web3;
