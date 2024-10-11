import Web3 from "web3";

let web3;
if (window.ethereum) {
  // Modern dapp browsers with MetaMask
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    await window.ethereum.enable();
  } catch (error) {
    console.error("User denied account access.");
  }
} else if (window.web3) {
  // Legacy dapp browsers
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Non-dapp browsers
  console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
}

export default web3;
