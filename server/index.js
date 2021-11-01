const express = require('express')
const bodyParser = require('body-parser');
const contractABI = require('./contract-abi.json');
const { pinJSONToIPFS } = require('./pinata');
const ethers = require("ethers");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = 5000;

const provider = new ethers.providers.JsonRpcProvider("https://eth-ropsten.alchemyapi.io/v2/Omut6TTae4fDt-6XuK5kF1Iy4xeZDUiz");

// get the current signer
const etherSigner = provider.getSigner();
console.log("signer url = ", etherSigner.provider.connection.url);

const privateKey = "037b879eb96ee5bf1f3d35c86f3f1ec16391798e08a1ae3a4d318ba651a5d9ac";

const walletWithProvider = new ethers.Wallet(privateKey, provider);

const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);

// send transaction post request
app.post('/sendTransaction', async (req, res) => {
    const { from, to, name, image, description } = req.body;
    const ipFsData = {
        name: name,
        image: image,
        description: description,
    }
    const pinataResponse = await pinJSONToIPFS(ipFsData);
    if (!pinataResponse.success) {
        res.send({ message: "something went wrong", reason: "invalid ipfs data" });
    }
    const tokenURI = pinataResponse?.pinataUrl;
    try {
        signedContract.mintNFT(from, tokenURI).then((data) => {
            // send some ethers to an etherium account
            walletWithProvider.sendTransaction({
                from: from,
                to: to,
                value: ethers.utils.parseEther("0.00000001"),
                gasLimit: "21000",
            }).then(result => {
                res.send({ message: "transction successfull", hash: result.hash, EtherScanUrl: "https://ropsten.etherscan.io/tx/" + result.hash, ipFs: tokenURI, nftResult: data });
                console.log("transction successfull = ", result.hash);
            }).catch((error) => {
                res.send({ message: "failed", reason: error?.reason })
                console.log("An error occurred = ", error?.reason);
            });
        }).catch((error) => {
            console.log("an error occurs", error);
        })
    } catch (error) {
        console.log(error);
        res.send({ message: "transaction failed", reason: error.toString() });
    }
})


// run express server
app.listen(port, () => {
    console.log(`Custom NFT minter app listening at http://localhost:${port}`)
})