require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const ANKR_URL = process.env.ANKR_URL;
const KEY = process.env.PRIVATE_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: ANKR_URL,
      accounts: [KEY],
    },
  },
};
