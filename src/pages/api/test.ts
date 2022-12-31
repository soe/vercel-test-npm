import type { NextApiRequest, NextApiResponse } from 'next'

import { DID } from "dids";
import {
    encodeDIDWithLit,
    Secp256k1ProviderWithLit,
} from "key-did-provider-secp256k1-with-lit";
import { getResolver } from "key-did-resolver";
import { Orbis } from "@orbisclub/orbis-sdk";
//import { forceIndexDid } from "@orbisclub/orbis-sdk/utils";


type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const profileDescription = "hola";
    const encodedDID = "Qma1H5pY89PooSJeoQAmADxP55scevbt9j3zucFrrzzQJb";
    const ipfsId = "";

    //pkpPublicKey=04df98f62aae4be61145a236b9ba0294292045b8ed87c6946627399de0ef83865cbefc30ce4a380775647a2601df6ab0b1b75a43951185253a1053826e240bb4b7
    //ipfsId=Qma1H5pY89PooSJeoQAmADxP55scevbt9j3zucFrrzzQJb
    //lockAddress=0x9cb8cbebc75256d05517bcef66bba2cc68eac7fb

    const provider = new Secp256k1ProviderWithLit({
      did: encodedDID,
      ipfsId: ipfsId as string,
    });

    const did = new DID({ provider, resolver: getResolver() });
    try {
        await did.authenticate();
    } catch (error) {
        console.error(error);
        if (error.message === "Unauthorized to sign") {
            console.log("Unauthorized: user is not part of the team");
        } else {
            console.log("DID authentication failed with error: " + error.message);
        }
        return;
    }

    let orbis = new Orbis();
    // Replicate the Orbis connect logic
    orbis.ceramic.did = did;
    orbis.session = {};
    orbis.session.id = did.id;
    try {
        //await forceIndexDid(did.id);
        await orbis.updateProfile({ description: profileDescription });
    } catch (error) {
        console.error(error);
        console.log(
            "Ceramic profile update failed with error: " + error.message
        );
        return;
    }

    res.status(200).json({ name: 'John Doe' })
}
