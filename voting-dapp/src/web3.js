import Web3 from "web3";

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    await window.ethereum.enable();  // Request account access
    console.log("MetaMask connected.");
  } catch (error) {
    console.error("User denied MetaMask access.");
  }
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);  // Legacy dApp browsers
} else {
  console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
}

export default web3;
