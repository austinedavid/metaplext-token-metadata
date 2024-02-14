import ourKeypairs from "./keypairget";
import * as web3 from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  some,
  none,
  PublicKey,
} from "@metaplex-foundation/umi";
import {
  UpdateMetadataAccountV2InstructionAccounts,
  Creator,
  Collection,
  Uses,
  UpdateMetadataAccountV2InstructionData,
  findMetadataPda,
  updateMetadataAccountV2,
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionDataArgs,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";

// this function below is for creating new token
async function CreateMetaData() {
  // returned the keypair of the person that created the token here
  const myKeypair = ourKeypairs();
  console.log(myKeypair.publicKey.toBase58());
  // here we need to get the public key of our mint token
  // create a dev connection with the umi flamework
  // then create a signer with the umi flamework
  const mint = new web3.PublicKey(
    "6cYs9C4aLfVX7UHmJZM1wsj2K6bG5JLXJuP8U3RDD1cU"
  );
  // create umi below
  const umi = createUmi("https://api.devnet.solana.com");
  // create the umi signer below
  // pass the new created umi and pass the keypair
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));

  // below is our object metadata
  const ourMetaData = {
    name: "JOBBER MAN",
    symbol: "JMAN",
    uri: "https://res.cloudinary.com/dffhwsp2h/image/upload/v1698191914/cld-sample-5.jpg",
  };
  // creating the data we will use onchain
  const onchainData = {
    ...ourMetaData,
    sellerFeeBasisPoints: 0,
    creators: none<Creator[]>(),
    collection: none<Collection>(),
    uses: none<Uses>(),
  };
  // lets first create the account
  const account: CreateMetadataAccountV3InstructionAccounts = {
    mint: fromWeb3JsPublicKey(mint),
    mintAuthority: signer,
  };
  // lets create the account data
  const data: CreateMetadataAccountV3InstructionDataArgs = {
    isMutable: true,
    collectionDetails: null,
    data: onchainData,
  };
  // lets now send the transaction onchain
  try {
    const txId = await createMetadataAccountV3(umi, {
      ...data,
      ...account,
    }).sendAndConfirm(umi);
    console.log(txId);
  } catch (error) {
    console.log(error);
  }
}

// function that update meta
async function UpdateMetaData() {
  // returned the keypair of the person that created the token here
  const myKeypair = ourKeypairs();
  console.log(myKeypair.publicKey.toBase58());
  // here we need to get the public key of our mint token
  // create a dev connection with the umi flamework
  // then create a signer with the umi flamework
  const mint = new web3.PublicKey(
    "6cYs9C4aLfVX7UHmJZM1wsj2K6bG5JLXJuP8U3RDD1cU"
  );
  // create umi below
  const umi = createUmi("https://api.devnet.solana.com");
  // create the umi signer below
  // pass the new created umi and pass the keypair
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));

  // below is our object metadata
  const ourMetaData = {
    name: "JOBWISE MAN",
    symbol: "JMANWISE",
    uri: "https://res.cloudinary.com/dffhwsp2h/image/upload/v1698191914/cld-sample-5.jpg",
  };
  // creating the data we will use onchain
  const onchainData = {
    ...ourMetaData,
    sellerFeeBasisPoints: 0,
    creators: none<Creator[]>(),
    collection: none<Collection>(),
    uses: none<Uses>(),
  };
  // here we create the data to be uploaded to the metaplex
  const data: UpdateMetadataAccountV2InstructionData = {
    data: some(onchainData),
    discriminator: 0,
    newUpdateAuthority: none<PublicKey>(),
    primarySaleHappened: none<boolean>(),
    isMutable: some(true),
  };
  // here we create the account for the data to be uploaded in metaplex
  const account: UpdateMetadataAccountV2InstructionAccounts = {
    metadata: findMetadataPda(umi, { mint: fromWeb3JsPublicKey(mint) }),
    updateAuthority: signer,
  };
  // below here, we then send the transaction to create the metadata here
  try {
    console.log("entered");
    const txId = await updateMetadataAccountV2(umi, {
      ...data,
      ...account,
    }).sendAndConfirm(umi);
    console.log(txId);
  } catch (error) {
    console.log(error);
  }
}
async function main() {
  // execute function that creates metadata
  // CreateMetaData();
  // execute function that update metadata
  UpdateMetaData();
}
main();
