import axios from "axios";
import { ethers } from "ethers";
import httpStatus from "http-status";
import { signedContract, walletWithProvider } from "../../../config/ether-configs";
import { pinJSONToIPFS } from "../../../utils/pinata";

// create a nft
const sendTransaction = async (req, res) => {
    const { futureOwner, name, image, description, attributes, external_url } = req.body;
    const ipFsData = {
        name: name,
        image: image,
        description: description,
        external_url: external_url,
        attributes: attributes
    }
    // submit data to pinata cloud and get back a response
    const pinataResponse = await pinJSONToIPFS(ipFsData);
    if (!pinataResponse.success) {
        res.end({ message: "something went wrong", reason: "invalid ipfs data" });
    }
    // @ts-ignore
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

const getNFTByTokenNo = async (req, res) => {
    const { tokenNumber } = req.body;
    signedContract.tokenURI(tokenNumber).then(async (response) => {
        // get nft details
        const nftDetails = await axios.get(response?.replace("ipfs://", ""))
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error?.message);
            });
        // prepare response
        res.status(httpStatus.OK);
        res.send({
            message: "success",
            // replace prefix of the url
            ipfs: response,
            nftDetails: {
                name: nftDetails?.name,
                image: nftDetails?.image,
                description: nftDetails?.description
            }
        });
        res.end();
    }).catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.send({ message: "failed", reason: error?.reason });
        res.end();
    })
}

export const controllers = {
    sendTransaction,
    getNFTByTokenNo
}
