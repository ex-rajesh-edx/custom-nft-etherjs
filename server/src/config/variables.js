const path = require('path');

// import .env variables
require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    apiEncryptionSecrete: process.env.API_ENCRYPTION_SECRETE,
    alchemyPrivateKey: process.env.AlCHEMY_PRIVATE_KEY,
    pinataKey: process.env.PINATA_KEY,
    pinataSecretKey: process.env.PINATA_SECRET_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    jsonRpcProviderAddress: process.env.JSON_RPC_PROVIDER,
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};