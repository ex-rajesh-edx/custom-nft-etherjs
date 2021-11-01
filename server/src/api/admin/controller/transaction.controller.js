const CryptoJS = require("crypto-js")
const ethers = require("ethers");
// const httpStatus = require("http-status")
const { apiEncryptionSecrete } = require("../../../config/variables");
const contractABI = require("../../../config/contract-abi.json");
const { pinJSONToIPFS } = require("../../../utils/pinata");
const { contractAddress, alchemyPrivateKey, jsonRpcProviderAddress } = require("../../../config/variables");

const provider = new ethers.providers.JsonRpcProvider(jsonRpcProviderAddress);

// get the current signer
const etherSigner = provider.getSigner();
console.log("signer url = ", etherSigner.provider.connection.url);

const walletWithProvider = new ethers.Wallet(alchemyPrivateKey, provider);

const signedContract = new ethers.Contract(contractAddress, contractABI, walletWithProvider);

// create a nft
exports.sendTransaction = async (req, res) => {
    // decrypt request body
    let decryptedText;
    let originalText;
    try {
        decryptedText = CryptoJS.AES.decrypt(req.body.data, apiEncryptionSecrete);
        originalText = JSON.parse(decryptedText.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        res.end("failed to decrypt params");
        // res.send({ message: "failed to decrypt params", status: 500 })
    }
    // destructure body parameters
    const { futureOwner, name, image, description } = originalText;
    const ipFsData = {
        name: name,
        image: image,
        description: description,
    }
    // submit data to pinata cloud and get back a response
    const pinataResponse = await pinJSONToIPFS(ipFsData);
    if (!pinataResponse.success) {
        res.end({ message: "something went wrong", reason: "invalid ipfs data" });
    }
    const tokenURI = pinataResponse?.pinataUrl;

    // mint nft
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
        res.end({ message: "transaction failed", reason: error.toString() });
    }
}
