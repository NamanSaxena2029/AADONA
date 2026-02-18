const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const emails = [
  "namansaxena2029@gmail.com",
  "dembaninain@gmail.com"
];

async function makeAdmins() {
  try {
    for (let email of emails) {
      const user = await admin.auth().getUserByEmail(email);

      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });

      console.log(`${email} is now ADMIN ✅`);
    }

    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

makeAdmins();
