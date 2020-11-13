import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin, initFirebase } from "../initFirebase";
import { getUser, refreshJWT } from "../userUtils";
const admin = require("firebase-admin");

let db = admin.firestore();
const firebase = require("firebase/app");
initFirebaseAdmin();
initFirebase();

export default async function setEmailAndPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("in set email & pw handler");
  let newPassword = req.body.newPassword;
  let newEmail = req.body.newEmail;
  var errored = false;

  let { uid, userRecord } = await getUser(req, res);

  if (uid === "") {
    res.statusCode = 403;
    res.end();
    return;
  }

//   await admin
//     .auth()
//     .updateUser(uid, {
//       email: email,
//       emailVerified: false
//     })
//     .then()
//     .catch(function(error: any) {
//       switch (error.code) {
//         case "auth/invalid-email":
//           res.status(403).send({
//             error:
//               "Email address is poorly formatted.",
//           });
//           errored = true;
//           return;
//         case "auth/email-already-exists":
//           res.status(403).send({
//             error: "Email already in use by another account.",
//           });
//           errored = true;
//           return;
//         default:
//           console.log(error);
//           res.status(403).send({
//             error: "Email reset failed",
//           });
//           errored = true;
//           return;
//       }
//     });

//   if (errored) {
//     return;
//   }

  let customToken = await admin
    .auth()
    .createCustomToken(uid)
    .then(function (customToken: any) {
      return customToken;
    })
    .catch(function (error: any) {
      console.log("Error creating custom token:", error);
      return "";
    });

  await firebase
  .auth()
  .signInWithCustomToken(customToken)
  .then(async function (firebaseUser: any) {
        let user = firebaseUser.user;
        admin
        .auth()
        .updateUser(uid, {
            email: newEmail,
            emailVerified: false,
            password: newPassword
        })
        .then(async function () {
            console.log("reset email & pw");
            await db.collection("users").doc(uid).set(
                {
                email: newEmail,
                method: "leaf",
                },
                { merge: true }
            );
            let userDataReference = await db.collection("users").doc(uid).get();
            let userData = await userDataReference.data();

            // await user.reload();
            console.log(user);

            // unlink google account 
            // let providerData = user.getProviderData();
            user.providerData.forEach(function (profile: any) {
                console.log("provider " + profile.providerId);
                if (profile.providerId === "google.com") {
                    console.log("unlinking google");
                    // user
                    // .unlink(profile.providerId)
                    // .catch(async function(error: any) {
                    //     switch (error.code) {
                    //         case "auth/id-token-expired":
                    //             let updatedUserToken = await refreshJWT(refreshToken);
                    //             // try again with refreshed token
                    //             req.cookies.userToken = updatedUserToken;
                    //             req.cookies.refreshToken = refreshToken;
                    //     }
                    // })
                }
            });
            console.log(user);


            res.status(200).end();  
            return;
        })
        .catch(function(error: any) {
            switch (error.code) {
                case "auth/invalid-password":
                    res.status(403).send({
                        error: "Password should be longer than 6 characters.",
                    });
                    errored = true;
                    return;
                case "auth/invalid-email":
                    console.log("We caught the error");
                    res.status(403).send({
                        error:
                        "Email address is poorly formatted.",
                    });
                    errored = true;
                    return;
                case "auth/email-already-exists":
                    res.status(403).send({
                        error: "Email already in use by another account.",
                    });
                    errored = true;
                    return;
                default:
                    console.log(error);
                    res.status(403).send({
                        error: "Reset failed",
                    });
                    errored = true;
                    return;
            }
        })
    });

    await firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("signed out success");
      })
      .catch(function(error: any) {
      });

  return;
}
