import axios from "axios";

export const getIpfsDetails = async (ipfs) => {
    // replace prefix
    const ipfsUrl = ipfs?.replace("ipfs://", "");
    return axios
        .get(ipfsUrl)
        .then(function (response) {
            console.log(response)
            return {
                success: true,
                result: response?.data
            };
        })
        .catch(function (error) {
            console.log("axios error", error)
            return {
                success: false,
                message: error.message,
            }
        });

}