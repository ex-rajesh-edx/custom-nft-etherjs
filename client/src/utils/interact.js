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
