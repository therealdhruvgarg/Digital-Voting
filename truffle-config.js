module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ganache port (default: none)
      network_id: "*",       // Any network (default: none)
      // 20 Gwei (adjust as needed)        // Increase gas limit for contract deployment
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true, // Enable optimizer for more efficient gas usage
          runs: 200,
        },
        evmVersion: "istanbul", // Ensure the EVM version matches your network
      },
    },
  },
  mocha: {
    reporter: 'spec', // Add this to get detailed logs
  },
};