import path from "path";

// import .env variables
require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});


export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const apiEncryptionSecrete = process.env.API_ENCRYPTION_SECRETE;
export const alchemyPrivateKey = process.env.AlCHEMY_PRIVATE_KEY;
export const pinataKey = process.env.PINATA_KEY;
export const pinataSecretKey = process.env.PINATA_SECRET_KEY;
export const contractAddress = process.env.CONTRACT_ADDRESS;
export const jsonRpcProviderAddress = process.env.JSON_RPC_PROVIDER;
export const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
