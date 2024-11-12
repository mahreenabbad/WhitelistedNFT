const fs = require("fs");
const keccak256 = require("keccak256");
const { default: MerkleTree } = require("merkletreejs");

const whitelist = [
  "0x117230682974d73f2DB5C21F0268De2fACB0119f",
  "0x4D6d151F4C2eE9211274c5895A1aDe0A291D43FA",
];

let leaves = whitelist.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const merkleRootHash = merkleTree.getHexRoot();
console.log("RootHash", merkleRootHash);

// Generate proofs for each address and save to JSON
const proofs = whitelist.map((addr) => {
  const proof = merkleTree.getHexProof(keccak256(addr));
  return { address: addr, proof };
});

// Save proofs to a JSON file
fs.writeFileSync("whitelist-proofs.json", JSON.stringify(proofs, null, 2));

//rootHash 0xfc07e4a47b05fcaea0849fc3e04eda235bb1384abcfa97a702bd42b9c7087c1c
