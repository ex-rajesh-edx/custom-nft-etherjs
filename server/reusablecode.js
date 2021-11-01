// get current block clients numbers of the etherium blockchain
// provider.getBlockNumber().then(res => console.log("Current client number on etherium blockchain = ",res));

// // get balance of an etherium account
// provider.getBalance("0xDfcf4beF67B116c32e066787b42c0F957409062E").then((res) => {
//     // format hex to either balance
//     const eithersBalance = ethers.utils.formatEther(res);
//     console.log("Eitherium balance of this account is = ", eithersBalance)
// });

// const wallet = new ethers.Wallet(privateKey);
// // Connect a wallet to mainnet
// let provider = ethers.getDefaultProvider();

// Get the balance of an address
// get balance
// daiContract.balanceOf("0xDfcf4beF67B116c32e066787b42c0F957409062E").then(res => {
//     console.log("Balance of this transaction = ", ethers.utils.formatEther(res));
// }).catch((error) => {
//     console.log("an error occurred"); 
// })
// get name
daiContract.name().then((res) => console.log("Name of the transaction = ", res))

// get symbol
daiContract.symbol().then(res => console.log("Symbol of this transaction = ", res))

// total supply
daiContract.totalSupply().then(res => console.log("total ethers supply of this transaction = ", ethers.utils.formatEther(res)));