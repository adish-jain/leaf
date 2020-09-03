import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";

const admin = require("firebase-admin");
let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
const { Storage } = require('@google-cloud/storage');

var fs = require("fs");
var shortId = require("shortid");

const storage = new Storage({
    keyFilename: "envVariables.json",
 });

let bucketName = "codingtutorials-95195.appspot.com";

const uploadFile = async(filename: string) => {   
    await storage.bucket(bucketName).upload(filename, {
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
});

console.log(`${filename} uploaded to ${bucketName}.`);
}

export default async function handleSaveImage(req: NextApiRequest, res: NextApiResponse) {
    console.log("inside handler");
    let image = req.body.imageFile;
    let b64 = image.split(",")[1];
    let mimeType = image.match(/^data:([^;]+);base64,(.*)$/);
    let imageType = mimeType[1].split("/")[1];
    let imageName = shortId.generate().toString() + "." + imageType;
    console.log(imageName);
    await fs.writeFile(imageName, b64, {encoding: 'base64'}, function(err: any) {
        if (err) {
            console.log(err);
        } else {
            console.log("file created");
        }
    });

    await uploadFile(imageName);
    res.status(200);
    res.end();
    return;
}
