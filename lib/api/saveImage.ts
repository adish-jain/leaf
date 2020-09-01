import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
const admin = require("firebase-admin");

let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
const storageService = firebase.storage();
const storageRef = storageService.ref();

export default async function handleSaveImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("in backend");
    let image = req.body.imageFile;
    console.log(image);
    const uploadTask = storageRef.child(`images/${image.name}`).put(image); //create a child directory called images, and place the file inside this directory
    // uploadTask.on('state_changed', (snapshot) => {
    // // Observe state change events such as progress, pause, and resume
    // }, (error) => {
    //     // Handle unsuccessful uploads
    //     console.log(error);
    // }, () => {
    //     // Do something once upload is complete
    //     console.log('success');
    // });
    res.status(200);
    res.end();
    return;
}
