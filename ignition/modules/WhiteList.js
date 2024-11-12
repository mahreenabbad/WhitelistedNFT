const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ROOT_HASH =
  "0xfc07e4a47b05fcaea0849fc3e04eda235bb1384abcfa97a702bd42b9c7087c1c";

module.exports = buildModule("WhiteListModule", (m) => {
  const whiteListContract = m.contract("WhiteList", [ROOT_HASH]);

  return { whiteListContract };
});

// contractAddress 0x35043b0151093E3335B261959DfabD3ff400cA21
