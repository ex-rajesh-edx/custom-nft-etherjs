const express = require('express')
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = 5000;

const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider("https://eth-ropsten.alchemyapi.io/v2/Omut6TTae4fDt-6XuK5kF1Iy4xeZDUiz");

// get the current signer
const etherSigner = provider.getSigner();
console.log("signer url = ", etherSigner.provider.connection.url);

const privateKey = "037b879eb96ee5bf1f3d35c86f3f1ec16391798e08a1ae3a4d318ba651a5d9ac";

const walletWithProvider = new ethers.Wallet(privateKey, provider);

const contractABI = require('./contract-abi.json')
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);

// send transaction post request
app.post('/sendTransaction', async (req, res) => {
    const { from, to, tokenUri } = req.body;
    let mintResult;
    const minterRes = signedContract.mintNFT(from, tokenUri).then((data) => {
        mintResult = data;
        // send some ethers to an etherium account
        walletWithProvider.sendTransaction({
            from: from,
            to: to,
            value: ethers.utils.parseEther("0.00000001"),
            gasLimit: "21000",
        }).then(result => {
            res.send({ message: "transction successfull", hash: result.hash, url: "https://ropsten.etherscan.io/tx/" + result.hash, nftResult: data });
            console.log("transction successfull = ", result.hash);
        }).catch((error) => {
            res.send({ message: "failed", reason: error?.reason })
            console.log("An error occurred = ", error?.reason);
        });
    }).catch((error) => {
        console.log("an error occurs", error);
    })
})


// run express server
app.listen(port, () => {
    console.log(`Custom NFT minter app listening at http://localhost:${port}`)
})