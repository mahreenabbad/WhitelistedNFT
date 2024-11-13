const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { expect } = require("chai");

describe("WhiteList", function () {
  async function runEveryTime() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const whitlistAddresses = [owner.address, addr1.address];
    const leaves = whitlistAddresses.map((addr) => keccak256(addr));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const rootHash = tree.getHexRoot();

    // const nftCount = 0;
    const uri = "MyNFT URI";
    const contractFactory = await ethers.getContractFactory("WhiteList");
    const whitelistContract = await contractFactory.deploy(rootHash);
    return { whitelistContract, uri, rootHash, tree, addr1, addr2, owner };
  }

  describe("WhiteList State Variable test cases", function () {
    it("Should check nftCount variable", async function () {
      const { whitelistContract } = await loadFixture(runEveryTime);
      expect(await whitelistContract.nftCount()).to.equal(0);
    });
    it("Should set rootHash properly", async function () {
      const { whitelistContract, rootHash } = await loadFixture(runEveryTime);
      expect(await whitelistContract.rootHash()).to.equal(rootHash);
    });
    it("Should set roothash in constructor", async function () {
      const { rootHash } = await loadFixture(runEveryTime);
      const whitelist = await ethers.getContractFactory("WhiteList");
      const contract = await whitelist.deploy(rootHash);

      expect(await contract.rootHash()).to.equal(rootHash);
    });
    it("should return correct name and symbol of nft", async function () {
      const { whitelistContract } = await loadFixture(runEveryTime);
      expect(await whitelistContract.name()).to.equal("Graduation Degree");
      expect(await whitelistContract.symbol()).to.equal("GRD");
    });
    describe("Whtelist For NFT minting", function () {
      it("Should fail for non-whitelist Addresses", async function () {
        const { whitelistContract, uri, addr2, tree } = await loadFixture(
          runEveryTime
        );
        const leaf = keccak256(addr2.address); //  leaf for addr2
        const proof = tree.getHexProof(leaf);
        await expect(
          whitelistContract.mintNFT(addr2.address, uri, proof)
        ).to.be.revertedWith("Not WhiteListed Address");
      });
      it("should increase nftCount after minting", async function () {
        const { whitelistContract, uri, addr1, tree, owner } =
          await loadFixture(runEveryTime);
        const leaf = keccak256(owner.address);
        const proof = tree.getHexProof(leaf);
        await whitelistContract.mintNFT(addr1.address, uri, proof);

        expect(await whitelistContract.nftCount()).to.equal(1);
      });
      it("Should only allow whitelist to mint", async function () {
        const { whitelistContract, uri, tree, owner, addr2 } =
          await loadFixture(runEveryTime);
        const leaf = keccak256(owner.address);
        const proof = tree.getHexProof(leaf);
        await expect(
          whitelistContract.connect(owner).mintNFT(addr2.address, uri, proof)
        )
          .to.emit(whitelistContract, "NftMinted")
          .withArgs(addr2.address, 0);
      });
      it("should fail for whitelist with incorrect proof", async function () {
        const { whitelistContract, uri, addr1, tree, owner } =
          await loadFixture(runEveryTime);
        const leaf = keccak256(owner.address);
        const proof = tree.getHexProof(leaf);
        await expect(
          whitelistContract.connect(addr1).mintNFT(addr1.address, uri, proof)
        ).to.be.revertedWith("Not WhiteListed Address");
      });
      it("Should return correct URI", async function () {
        const { whitelistContract, uri, addr2, tree, owner } =
          await loadFixture(runEveryTime);
        const leaf = keccak256(owner.address);
        const proof = tree.getHexProof(leaf);
        await whitelistContract
          .connect(owner)
          .mintNFT(addr2.address, uri, proof);
        expect(await whitelistContract.tokenURI(0)).to.equal(uri);
      });
    });
  });
});
