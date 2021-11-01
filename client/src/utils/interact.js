import { pinJSONToIPFS } from './pinata.js';
require('dotenv').config();
const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/Omut6TTae4fDt-6XuK5kF1Iy4xeZDUiz";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json')
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

// mint nft with express erver
/* 
accepted json body
{
    "futureOwner": "0xDfcf4beF67B116c32e066787b42c0F957409062E",
    "name": "Express server",
    "image": "http://thedemobay.com/wp-content/uploads/2014/11/far-cry-4-demo-41.png",
    "description": "nft minted with express server"
}
*/
const axios = require('axios');
const CryptoJS = require("crypto-js");
export const minNFTWithExpress = async (JSONBody) => {
  const url = `http://localhost:5000/sendTransaction`;
  //making axios POST request to Pinata ⬇️
  // encrypting with crypto js second parameter is secret key
  const encryptedData = await CryptoJS.AES.encrypt(JSON.stringify(JSONBody), "area56").toString();
  const dataToBeSent = { data: encryptedData };
  console.log(dataToBeSent);
  return axios
    .post(url, dataToBeSent)
    .then(function (response) {
      return {
        success: true,
        response: response
      };
    })
    .catch(function (error) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      }
    });
};

export const mintNFT = async (url, name, description) => {

  //error handling
  if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    }
  }

  //make metadata
  // eslint-disable-next-line no-new-object
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //pinata pin request
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    }
  }
  // getting pinta uri of our nft item/asset
  const tokenURI = pinataResponse.pinataUrl;

  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

