import React, { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, minNFTWithExpress } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [futureOwner, setFutureOwner] = useState("");
  const [mintResult, setmintResult] = useState();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => { //TODO: implement
    setStatus("Loading................");
    // const { status } = await mintNFT(url, name, description);
    // setStatus(status);
    setmintResult("");
    const mintResponse = await minNFTWithExpress({
      futureOwner: futureOwner,
      name: name,
      image: url,
      description: description
    })
    console.log(mintResponse);
    setmintResult(mintResponse?.response?.data);
    setStatus(mintResponse?.success);
  };
  // metamask wallet listener
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  // using alchemy
  // const  alchemyWeb3 = async () => {
  //  const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/TEo6mtObnLKc09j_c3iQqAtibKgUEiFY");
  //  const blockNumber = await web3.eth.getBlockNumber();
  //  console.log("The latest block number is " + blockNumber);
  //   }
  //   alchemyWeb3();


  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🤵 Future Owner: </h2>
        <input
          type="text"
          placeholder="wallet address e.g. 0xDfcf4beF67B116c32e066787b42c0F957409062E"
          onChange={(event) => setFutureOwner(event.target.value)}
        />
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
      {
        mintResult &&
        <React.Fragment>
          <h3>Mint Result:::</h3>
          <p>
            <b>Message: </b>{mintResult?.message}<br />
            <b>minthash: </b>{mintResult?.hash}<br />
            <b>EtherScanUrl: </b>{mintResult?.EtherScanUrl}<br />
            <b>NFT: </b>{mintResult?.ipFs}<br />
          </p>
        </React.Fragment>
      }
    </div>
  );
};

export default Minter;
