import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, userNameErrorMessage } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
initFirebaseAdmin();
initFirebase();

export default async function setIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let username = req.body.username;
  let errorMsg = await userNameErrorMessage(username);
  if (errorMsg !== "") {
    res.statusCode = 403;
    res.send({
      error: errorMsg,
    });
    return;
  }
  let { uid } = await getUser(req, res);

  // if (uid === "") {
  //   res.statusCode = 403;
  //   res.send({
  //     error: "Username taken",
  //   });
  //   return;
  // }

  // console.log("hello");
  // let checkValid = isValid(username)

  // if (!checkValid.valid) {
  //   res.statusCode = 403;
  //   res.send({
  //     error: checkValid.reason,
  //   });
  //   return;
  // }

  await db.collection("users").doc(uid).set(
    {
      username: username,
    },
    { merge: true }
  );

  res.statusCode = 200;
  res.send({
    usernameUpdated: true,
  });
  return;
}

// function isValid(username: string) {
//   // if (username.length === 0 || username.length > 15) {
//   //   return {
//   //     "valid": false, 
//   //     "reason": "Check the length of your username"
//   //   };
//   // }

//   let regex = new RegExp("^\S+\w{8,32}\S{1,}");

//   if (!regex.test(username)) {
//     return {
//       "valid": false, 
//       "reason": "Check your username"
//     };
//   }

//   return {
//     "valid": true, 
//     "reason": ""
//   };
  // return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username);
// }
