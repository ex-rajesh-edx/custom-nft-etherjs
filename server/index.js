const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const contractABI = require('./contract-abi.json');
const { pinJSONToIPFS } = require('./pinata');
const ethers = require("ethers");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const provider = new ethers.providers.JsonRpcProvider("https://eth-ropsten.alchemyapi.io/v2/Omut6TTae4fDt-6XuK5kF1Iy4xeZDUiz");

// get the current signer
const etherSigner = provider.getSigner();
console.log("signer url = ", etherSigner.provider.connection.url);

const privateKey = "8131f9de16b97f2651df13db65a38cfa819e4466c94526e38a11aaa27b378479";

const walletWithProvider = new ethers.Wallet(privateKey, provider);

const contractAddress = "0xeD4E0f9a31a4cB34280815d56eFae9569831a5aa";

const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);

const CryptoJS = require("crypto-js")
// send transaction post request
app.post('/sendTransaction', async (req, res) => {
    // decrypted data
    // @ToDo: change the way we use secret key
    const decryptedText = CryptoJS.AES.decrypt(req.body.data, "area56");
    const originalText = JSON.parse(decryptedText.toString(CryptoJS.enc.Utf8));
    const { futureOwner, name, image, description } = originalText;
    const ipFsData = {
        name: name,
        image: image,
        description: description,
    }
    const pinataResponse = await pinJSONToIPFS(ipFsData);
    if (!pinataResponse.success) {
        res.end({ message: "something went wrong", reason: "invalid ipfs data" });
    }
    const tokenURI = pinataResponse?.pinataUrl;
    try {
        signedContract.mintToken(futureOwner, tokenURI).then((data) => {
            // send some ethers to an etherium account
            walletWithProvider.sendTransaction({
                to: futureOwner,
                value: ethers.utils.parseEther("0.00000001"),
                gasLimit: "21000",
            }).then(result => {
                res.send({ message: "transction successfull", hash: result.hash, EtherScanUrl: "https://ropsten.etherscan.io/tx/" + data?.hash, ipFs: tokenURI, nftResult: data });
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