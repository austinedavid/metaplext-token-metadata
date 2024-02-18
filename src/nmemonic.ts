// here, we learnt how to generate the secrete phrase
import * as bip39 from "bip39";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const generateSecrete = async () => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const mnemonic = bip39.generateMnemonic();
  const laws =
    "engine essence hire vote expire find arena movie awesome milk banner adjust";
  console.log(mnemonic, typeof mnemonic);

  const seed = bip39.mnemonicToSeedSync(laws, "");
  console.log(seed);
  //   retrieve the keypairs from the seed
  const newkeypair = Keypair.fromSeed(seed.slice(0, 32));
  console.log(newkeypair.publicKey.toBase58());
  const balance1 = await connection.getBalance(newkeypair.publicKey);
  console.log("initial balance: ", balance1);
  await connection.requestAirdrop(newkeypair.publicKey, LAMPORTS_PER_SOL);
  const balance2 = await connection.getBalance(newkeypair.publicKey);
  console.log("after balance ", balance2);
  console.log(newkeypair.secretKey.toString());
};
