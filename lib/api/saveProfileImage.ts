import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser } from "../userUtils";

const admin = require("firebase-admin");
let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
const { Storage } = require('@google-cloud/storage');

// Create envVariables.json to store files in Firebase storage
const envVar = require("../../createEnvVariablesJson");
envVar.createEnvVariablesJson();

var fs = require("fs");
var shortId = require("shortid");

const storage = new Storage({
    keyFilename: "/tmp/" + "envVariables.json",
 });

let bucketName = process.env.STORAGE_BUCKET;

const uploadImage = async(imageName: string) => {   
    await storage.bucket(bucketName).upload(imageName, {
        public: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    })
}

const generateImageURL = async(imageName: string) => {
    let imageURL = `https://storage.googleapis.com/${bucketName}/${imageName}`
    return imageURL;
}

const saveImageToProfile = async(uid: string, imageURL: string) => {
    await db
    .collection("users")
    .doc(uid)
    .update({ profileImage: imageURL });
}

export default async function handleSaveProfileImage(req: NextApiRequest, res: NextApiResponse) {
    let { uid } = await getUser(req, res);
    if (uid === "") {
        res.statusCode = 403;
        res.end();
        return;
    }

    // get img data
    let image = req.body.imageFile;
    let b64 = image.split(",")[1];
    let mimeType = image.match(/^data:([^;]+);base64,(.*)$/);
    let imageType = mimeType[1].split("/")[1];
    let imageName = shortId.generate().toString() + "." + imageType;

    // create img file locally temporarily
    await fs.writeFile("/tmp/" + imageName, b64, {encoding: 'base64'}, function(err: any) {
        if (err) {
            console.log(err);
        } else {
        }
    });

    // upload img file to firebase storage 
    await uploadImage("/tmp/" + imageName);

    // generate public URL for img file to save to firestore
    let imageURL = await generateImageURL(imageName);

    // save img URL to firestore under relevant profile
    await saveImageToProfile(uid, imageURL);

    // delete local img 
    fs.unlinkSync("/tmp/" + imageName);

    res.statusCode = 200;    
    res.send({url: imageURL});
    return;
}
