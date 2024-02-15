// here, we learnt how to generate the secrete phrase
import * as bip39 from "bip39";
import { Keypair } from "@solana/web3.js";

export const generateSecrete = async () => {
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic, typeof mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic, "");
  console.log(seed);
  //   retrieve the keypairs from the seed
  const newkeypair = Keypair.fromSeed(seed.slice(0, 32));
  console.log(newkeypair.publicKey.toBase58());
};
