import React from "react";
import Login from "./components/Login";
import './index.css'

function App() {
  return (
    <div className="App px-7 bg-slate-50 h-screen">
      <h1 className="text-gray-600 font-semibold border-b border-gray-200 text-3xl text-center py-3 ">Welcome to the <span className="text-black">Blockchain</span>  Voting DApp</h1>
      <Login />
      <footer className="absolute bottom-0 right-0 mr-7 mb-4">Blockchain Voting DApp - Powered by Ethereum</footer>
    </div>
  );
}

export default App;
