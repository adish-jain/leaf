module.exports.createEnvVariablesJson = function() {
    result = {};
    result["key"] = process.env.FIREBASE_SERVER_KEY;
    result["type"] = "service_account";
    result["project_id"] = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    result["private_key_id"] = process.env.FIREBASE_PRIVATE_KEY_ID;
    result["private_key"] = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    result["client_email"] = process.env.FIREBASE_CLIENT_EMAIL;
    result["client_id"] = process.env.CLIENT_ID;
    result["auth_uri"] = "https://accounts.google.com/o/oauth2/auth";
    result["token_uri"] = "https://oauth2.googleapis.com/token";
    result["auth_provider_x509_cert_url"] = "https://www.googleapis.com/oauth2/v1/certs";
    result["client_x509_cert_url"] = process.env.CLIENT_CERT_URL;

    var fs = require("fs");
    fs.writeFile("envVariables.json", JSON.stringify(result), {encoding: 'utf8'}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("file created");
        }
    });
}
