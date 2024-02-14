// here we will get our key pair for the program as needed from our dotenv
import * as web3 from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

const ourKeypair = (): web3.Keypair => {
  // get the secrete key here
  const privateKey = process.env.SECRETE_KEY;
  console.log(privateKey);
  // convert it back to based json
  const parsedPrivateKey = JSON.parse(privateKey ?? "") as number[];
  // convert it back to uint8array
  const uint8array = Uint8Array.from(parsedPrivateKey);
  // now we can get the keypairs from the keypairs method
  const keypairs = web3.Keypair.fromSecretKey(uint8array);
  return keypairs;
};

export default ourKeypair;
