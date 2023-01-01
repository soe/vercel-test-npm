import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Cors from 'cors';

import { DID } from "dids";
import {
    encodeDIDWithLit,
    Secp256k1ProviderWithLit,
} from "key-did-provider-secp256k1-with-lit";
import { getResolver } from "key-did-resolver";
import { Orbis } from "@orbisclub/orbis-sdk";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
});
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Run the middleware
    await runMiddleware(req, res, cors);
    
    if (req.method === "POST") {
        const rawBody = (await buffer(req)).toString();
        const data = JSON.parse(rawBody);
        console.log(data);
        res.status(200);


        const postText = "Hola! Pinata!";

        // Lit action JS's IPFS address
        const ipfsId = "Qma1H5pY89PooSJeoQAmADxP55scevbt9j3zucFrrzzQJb";

        // get DID from the Lit PKP's publickey
        const encodedDID = await encodeDIDWithLit(
            "04df98f62aae4be61145a236b9ba0294292045b8ed87c6946627399de0ef83865cbefc30ce4a380775647a2601df6ab0b1b75a43951185253a1053826e240bb4b7"
        );

        const provider = new Secp256k1ProviderWithLit({
            did: encodedDID,
            ipfsId: ipfsId as string,
            // @ts-ignore
            authSig: {
                "sig": "0x4e97bc3c2ab08fe7e6beef7828ecb7bebbd569be31e65ce982792c501a9da1952a1449c3666ba0222081a08819e39cde57a26f5086c6a5026f849bb6d896087d1c",
                "derivedVia": "web3.eth.personal.sign",
                "signedMessage": "vercel-test-npm.vercel.app wants you to sign in with your Ethereum account:\n0xa46574434328a8594851b5267EC0a4e6aB14316f\n\n\nURI: https://vercel-test-npm.vercel.app/action?pkpPublicKey=04df98f62aae4be61145a236b9ba0294292045b8ed87c6946627399de0ef83865cbefc30ce4a380775647a2601df6ab0b1b75a43951185253a1053826e240bb4b7&lockAddress=0x9cb8cbebc75256d05517bcef66bba2cc68eac7fb&ipfsId=Qma1H5pY89PooSJeoQAmADxP55scevbt9j3zucFrrzzQJb\nVersion: 1\nChain ID: 80001\nNonce: WZuKGmFSE1W0ifdpe\nIssued At: 2022-12-29T13:05:51.452Z\nExpiration Time: 2023-01-05T13:05:43.158Z",
                "address": "0xa46574434328a8594851b5267EC0a4e6aB14316f"
            }
        });

        // authenticate PKP's DID
        const did = new DID({ provider, resolver: getResolver() });
        try {
            await did.authenticate();
        } catch (error) {
            console.error(error);

            if (error.message === "Unauthorized to sign") {
                console.log("Unauthorized: user is not part of the team");
                res.status(500).send("Unauthorized: user is not part of the team");
            }

            console.log("DID authentication failed with error: " + error.message);
            res.status(500).send("DID authentication failed with error: " + error.message);
        }

        // Connect DID to the Orbis
        let orbis = new Orbis();
        orbis.ceramic.did = did;
        orbis.session = {};
        orbis.session.id = did.id;

        // Now can do whaterver calls to Orbis SDK
        try {
            //await orbis.updateProfile({ description: profileDescription });

            await orbis.createPost(
                {
                    "body": "The Ceramic Data Network is a decentralized, peer-to-peer network that provides a scalable, secure, and composable platform for storing and sharing data. Built on the InterPlanetary File System (IPFS) and the Ethereum blockchain, the Ceramic Data Network allows users to create and manage verifiable, tamper-evident records that can be shared and accessed by anyone with the appropriate permissions.\n\n## **Understanding Ceramic**\n\nOne of the key features of the Ceramic Data Network is its composability. This means that the network is designed to be easily integrated with other applications and services, allowing for seamless and interoperable data sharing. This makes the Ceramic Data Network an ideal platform for building complex data-driven applications and services, and for enabling data-driven innovation and collaboration.\n\n\\\nThis is being achieved by the schemas or models used as standards for streams created on the network. Ceramic Schemas are simple JSON rules that developers must follow when sharing content with a specific schema. It’s like the ERC721 or ERC20 standards on Ethereum but for the entire internet instead.\n\n\\\nAnother key feature of the Ceramic Data Network is its support for data ownership. This means that users have the ability to create and manage their own digital identities and to control which information they share and with whom. This gives users more control over their online privacy and allows them to share their data in a way that is secure, transparent, and trustful.\n\n\\\nAdditionally, the Ceramic Data Network is highly scalable. Unlike traditional centralized data storage systems, which can become slow and cumbersome as they grow in size, the Ceramic Data Network is designed to be scalable and efficient, even as the amount of data on the network increases. This allows the network to support a wide range of applications and use cases, from simple file sharing to complex data management and governance.\n\n\\\nFinally, the Ceramic Data Network is decentralized, meaning that there is no central authority that controls or manages the network. This allows for a more open, transparent, and fair online community, where users have the ability to contribute to the network and to have a say in how it is run. It also means that the network is resistant to censorship and other forms of centralized control, which can help to foster a more open and inclusive internet.\n\n## **What is ComposeDB from Ceramic?**\n\nComposeDB is a distributed database system that is built on top of the Ceramic Data Network, it extends the capabilities of the Ceramic Data Network by providing a powerful, easy-to-use database system that allows users to store, query, and update data on the network using simple GraphQL queries. ComposeDB will allow developers to query Ceramic content very easily without having to build their own indexing system.\n\n\\\nOne of the key features of ComposeDB is its scalability, it inherits the network's ability to scale efficiently and support a large number of users and data records. This makes ComposeDB an ideal platform for applications that require the ability to store and manage large amounts of data, such as social networks, messaging apps, or e-commerce platforms. \\n \n\nAnother key feature of ComposeDB is its ease of use, when fully ready, ComposeDB will provide a simple, intuitive interface that allows developers and users to easily retrieve and manage data on the network.\n\n## **Conclusion**\n\nIn conclusion, the Ceramic Data Network is a decentralized, peer-to-peer network that provides a scalable, secure, and composable platform for storing and sharing data. With its support for data ownership, composability, and decentralization, the Ceramic Data Network has the potential to revolutionize the way we store, share, and access data online.\n\n\\\nIt’s at the core of our infrastructure at Orbis.",
                    "data": {
                        "abstract": "Learn more about the Ceramic Data Network, a new peer-to-peer network that provides a scalable, secure, and composable platform for storing and sharing data."
                    },
                    "media": [
                        {
                            "url": "ipfs://QmXvPXibb2D7iefGPfNoEwHuecieJif5mnvck4eRY78XyF",
                            "gateway": "https://orbis.mypinata.cloud/ipfs/"
                        }
                    ],
                    "title": "What is the Ceramic Data Network?",
                    "context": ""
                }
            );
        } catch (error) {
            console.error(error);
            console.log("Orbis action failed with error: " + error.message);

            res.status(500).send("Orbis action failed with error: " + error.message);
        }

        res.status(200).json("Orbis action success: " + postText);
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}