/* globals window */
const firebase = require('firebase/app');
import "firebase/auth";

export default async function logout() {
  return firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      if (typeof window !== "undefined") {
        // Remove the server-side rendered user data element. See:
        // https://github.com/vercel/next.js/issues/2252#issuecomment-353992669
        let elem: HTMLElement | null;
        try {
          elem = window.document.getElementById("__MY_AUTH_USER_INFO");
          if (elem == null) {
            throw new Error("Whoops!");
          }
          if (elem.parentNode == null) {
            throw new Error("Whoops!");
          }
          elem.parentNode.removeChild(elem);
        } catch (e) {
          console.error(e);
        }
      }
      return true;
    })
    .catch((e: any) => {
      console.error(e);
      return false;
    });
}
