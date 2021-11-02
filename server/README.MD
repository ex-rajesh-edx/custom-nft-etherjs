## CREATE A NFT
    - http://localhost:5000/client/send-transaction
    - http://localhost:5000/client/send-transaction
Payload format - 
`admin requests should be encrypted with same key which is used by server to decrypt the request params`
```js
{
    futureOwner: "0xDfcf4beF67B116c32e066787b42c0F957409062E",
    name: "Express server",
    imag": "http://thedemobay.com/wp-content/uploads/2014/11/far-cry-4-demo-41.png",
    description: "nft minted with express server"
}
```

## READ A NFT
    -http://localhost:5000/admin/send-transaction
    http://localhost:5000/client/send-transaction 
```js
{
    tokenNumber: 20
}
```