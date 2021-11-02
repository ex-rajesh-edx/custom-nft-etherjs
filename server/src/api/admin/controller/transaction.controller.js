const CryptoJS = require("crypto-js")
const ethers = require("ethers");
const httpStatus = require("http-status")
import { signedContract, walletWithProvider } from "../../../config/ether-configs";
const { apiEncryptionSecrete } = require("../../../config/variables");
const { pinJSONToIPFS } = require("../../../utils/pinata");

// create a nft
const sendTransaction = async (req, res) => {
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
                res.status(httpStatus.OK);
                res.send({ message: "transction successfull", hash: result.hash, EtherScanUrl: "https://ropsten.etherscan.io/tx/" + data?.hash, ipFs: tokenURI, nftResult: data });
                console.log("transction successfull = ", result.hash);
            }).catch((error) => {
                res.status(httpStatus.NOT_FOUND)
                res.send({ message: "failed", reason: error })
                console.log("An error occurred = ", error);
            });
        }).catch((error) => {
            // console.log("an error occurs", error);
            res.status(httpStatus.NOT_ACCEPTABLE)
            res.send({ message: "transaction failed", reason: error.toString() });
        })
    } catch (error) {
        console.log(error);
        res.status(httpStatus.EXPECTATION_FAILED)
        res.send({ message: "something went wrong", reason: error.toString() });
    }
}



export const controllers = {
    sendTransaction,
}