import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // MetaMask is available
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // Fallback to Truffle Develop network
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
  web3 = new Web3(provider);
}

export default web3;
