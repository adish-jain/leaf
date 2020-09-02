import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";

const admin = require("firebase-admin");

let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();
// const storageService = firebase.storage();
// const storageRef = storageService.ref();

const {Storage} = require('@google-cloud/storage');

// const config = ;

const storage = new Storage({
    keyFilename: "envVariables.json",
 });


let bucketName = "codingtutorials-95195.appspot.com";

let filename = 'test1.txt';


// Testing out upload of file
const uploadFile = async() => {   
// Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        // gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
});

console.log(`${filename} uploaded to ${bucketName}.`);
}

export default async function handleSaveImage(req: NextApiRequest, res: NextApiResponse) {
    console.log("inside handler");
    await uploadFile();
    res.status(200);
    res.end();
    return;
}






// import { NextApiRequest, NextApiResponse } from "next";
// import { initFirebaseAdmin, initFirebase } from "../initFirebase";

// const admin = require("firebase-admin");

// let db = admin.firestore();
// const firebase = require("firebase/app");
// initFirebaseAdmin();
// initFirebase();
// const storageService = firebase.storage();
// const storageRef = storageService.ref();

// global.atob = require("atob");
// // Blob = require("node-fetch");

// var fs = require("fs");

// // function urltoFile(url: any, filename: string, mimeType: any){
// //     mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
// //     return new Blob([url], filename, {type:mimeType});
// // }
// // const img = require("/Users/Adish/Desktop/Leaf/devenvironment/public/images/adi.png");
// //@ts-ignore
// // var img = new Blob([""], "adi.png");

// export default async function handleSaveImage(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//     console.log("in backend");
//     // console.log(img);
//     console.log(req.body.imageFile);
//     // console.log(req);

//     let image = req.body.imageFile;
//     var png = image.split(',')[1];
//     await fs.writeFile("test.png", png, {encoding: 'base64'}, function(err: any) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("file created");
//         }
//     });

//     var testRef = storageRef.child('test.png');
//     var testImagesRef = storageRef.child('images/test.png');



//     // console.log(atob(png));
//     // // var file = new Blob([atob(png)], {type: 'image/png', encoding: 'utf-8'});
//     // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
//     // console.log(blob);
//     // console.log(file);
//     // let img = url("img1.png")
//     // let matches = image.match(/^data:([^;]+);base64,(.*)$/);
//     // let mimeType = matches[1];
//     // console.log(mimeType);

//     // let file = await urltoFile(image, "test.png", mimeType).then(function(file: any){ console.log(file);});
//     // console.log(file);
//     // console.log(image);
//     // let image = req.body.imageFile;
//     // console.log(image);

//     // const blob = new Blob([image], {type: "application/json"});
//     // const file = new File([blob], "FileName.json");
//     // console.log(blob);

//     // function srcToFile(src: string, fileName: string, mimeType: string){
//     //     return (fetch(src)
//     //         .then(function(res){return res.arrayBuffer();})
//     //         .then(function(buf){return new File([buf], fileName, {type:mimeType});})
//     //     );
//     // }

//     // const img = await srcToFile("/Users/Adish/Desktop/Leaf/devenvironment/public/images/adi.png", "adi.png", "image/png");
//     // console.log(img);

//     // const uploadTask = storageRef.child(`images/${img.name}`).put(img); //create a child directory called images, and place the file inside this directory
//     // uploadTask.on('state_changed', (snapshot) => {
//     // // Observe state change events such as progress, pause, and resume
//     // }, (error) => {
//     //     // Handle unsuccessful uploads
//     //     console.log(error);
//     // }, () => {
//     //     // Do something once upload is complete
//     //     console.log('success');
//     // });
//     res.status(200);
//     res.end();
//     return;
// }
