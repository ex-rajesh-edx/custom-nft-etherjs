import { ethers } from "ethers";
import contractABI from "./contract-abi.json";
import { alchemyPrivateKey, contractAddress, jsonRpcProviderAddress } from "./variables";


export const provider = new ethers.providers.JsonRpcProvider(jsonRpcProviderAddress);

// get the current signer
// export const etherSigner = provider.getSigner();
// console.log("signer url = ", etherSigner.provider.connection.url);

export const walletWithProvider = new ethers.Wallet(alchemyPrivateKey, provider);

export const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);