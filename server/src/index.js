const { port, env } = require('./config/variables');
const contractABI = require('./contract-abi.json');
const { pinJSONToIPFS } = require('./utils/pinata');
const ethers = require("ethers");
const CryptoJS = require("crypto-js")
const { contractAddress, alchemyPrivateKey, jsonRpcProviderAddress } = require("./config/variables");
// const logger = require('./config/logger');
const app = require('./config/express');

// listen to requests
app.listen(port, () => console.log(`server started on port ${port} (${env})`));


const provider = new ethers.providers.JsonRpcProvider(jsonRpcProviderAddress);

// get the current signer
const etherSigner = provider.getSigner();
console.log("signer url = ", etherSigner.provider.connection.url);

const walletWithProvider = new ethers.Wallet(alchemyPrivateKey, provider);

const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);

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
