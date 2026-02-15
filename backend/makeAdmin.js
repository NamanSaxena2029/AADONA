const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = "namansaxena2029@gmail.com";

async function makeAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });

    console.log("User is now ADMIN ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

makeAdmin();
