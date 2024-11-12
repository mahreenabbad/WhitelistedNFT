// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WhiteList is ERC721, ERC721URIStorage {
    bytes32 public rootHash; //this will be generate either from front end or backend

    uint public nftCount = 0;

    event NftMinted(address to, uint tokenId);

    constructor(bytes32 _rootHash) ERC721("Graduation Degree", "GRD") {
        rootHash = _rootHash;
    }

    function mintNFT(
        address _to,
        string memory uri,
        bytes32[] calldata proof
    ) public {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(proof, rootHash, leaf),
            "Not WhiteListed Address"
        );

        _safeMint(_to, nftCount);
        _setTokenURI(nftCount, uri);
        emit NftMinted(_to, nftCount);
        nftCount++;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// modifier isWhitelistedAddress(bytes32[] calldata proof) {
// require(
//     verifyProof(proof, keccak256(abi.encodePacked(msg.sender))),
//     "Not WhiteListed Address"
// );
// _;
// }

// function onlyWhitelisted(
//     bytes32[] calldata proof
// ) public view isWhitelistedAddress(proof) returns (uint8) {
//     return 5;
// }