const { ethers, artifacts } = require("hardhat");

// const fs = require("fs");
require("dotenv").config();

// const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

async function main() {
  const rpcUrl =
    "https://eth-sepolia.g.alchemy.com/v2/Auy-_mNgq1B1FrqTe9cFJnUCNiorWnZC";

  const contractAddress = "0x35043b0151093E3335B261959DfabD3ff400cA21";
  const recipientAddress = "0x117230682974d73f2DB5C21F0268De2fACB0119f"; // Address to receive the NFT

  const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, {
    staticNetwork: true,
  });
  const PRIVATE_KEY = process.env.PRIVATE_KEY_WHITELIST2;
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("signer :", signer);

  const uri =
    "https://aquamarine-dear-whitefish-514.mypinata.cloud/ipfs/QmPyJBR2DgwnGEk8sQSfbwsGQgotNXBAMoHohQ9yZ2y9y4";

  const whitelistArtifact = await artifacts.readArtifact("WhiteList"); // Console the ABI
  const whitelistAbi = whitelistArtifact.abi;

  const whitelistContract = new ethers.Contract(
    contractAddress,
    whitelistAbi,
    signer
  );

  const proof1 = [
    "0x11429ca9e6e52f6a9c4def505a7d631794a6bc5e3e6eeaf6cab4389481a410bc",
  ];
  const proof2 = [
    "0x850111777fee566332cb16276d868623026fc7db293f9a11ad4993b43a661c3d",
  ];
  try {
    const receipt = await whitelistContract.mintNFT(
      recipientAddress,
      uri,
      proof2
    );

    console.log("receipt :", receipt);
  } catch (error) {
    console.error("Transaction failed:", error.message || error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
