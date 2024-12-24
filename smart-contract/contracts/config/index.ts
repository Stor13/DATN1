import * as dotEnv from 'dotenv';

dotEnv.config();

export const coinMcApiKey : string | any = process.env.COINMARKETCAP_API_KEY;
export const privKey : string | any = process.env.PRIVATE_KEY;
export const baseScanApiKey: string | any = process.env.BASESCAN_API_KEY; 
export const testnetNodeUrl: string | any = process.env.ALCHEMY_API_TESTNET;
export const mainnetNodeUrl: string | any = process.env.ALCHEMY_API_MAINNET;