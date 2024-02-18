import keypairs from "./keypairget";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";

const mineNft = async () => {
  const wallet = keypairs();
  const connection = new Connection(clusterApiUrl("devnet"));
  //   create an instance of the metaplex
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 6000,
      })
    );
  // lets get the image from it file
  //   and convert it to a buffer using the metaplexFile
  const buffer = fs.readFileSync(path.resolve(__dirname, "./image/avatar.jpg"));
  const file = toMetaplexFile(buffer, "image.jpg");

  //   here we send the image to the onchain arwave now
  const img = await metaplex.storage().upload(file);
  //   here we send the NFT metadata to the onchain arwave
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "AVATER EARTH BENDER",
    symbol: "AVA",
    description:
      "This is the greatest air bender of our time lets appreciate him",
    image: img,
  });
  const initCreate = false;
  //   then, since we have uploaded our external data to the arwave storage space
  // lets then create the NFT in the using the metaplex helper function needed
  if (initCreate) {
    const { nft } = await metaplex.nfts().create(
      {
        name: "AVATAR EARTH",
        symbol: "AVA",
        uri: uri,
        sellerFeeBasisPoints: 0,
      },
      { commitment: "finalized" }
    );
    console.log(nft);
  } else {
    const mintPubkey = "3Z4eWZA11XcPzXw7Hp9QkKP3UugyPnrCVYorJVbaqS7B";
    const mintPub = new PublicKey(mintPubkey);
    // LETS FIND THE NFT IT SELF
    const myNft = await metaplex.nfts().findByMint({ mintAddress: mintPub });
    const { response } = await metaplex.nfts().update({
      nftOrSft: myNft,
      name: "AVATER EARTH BENDER",
      uri: uri,
      sellerFeeBasisPoints: 100,
    });
    console.log(response);
  }
};
export default mineNft;
