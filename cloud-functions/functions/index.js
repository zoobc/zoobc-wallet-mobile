const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.addMessage = functions.https.onRequest(async (req, res) => {
        // Grab the text parameter.
        const original = req.query.text;
        console.log('=== tect: ', original);


        var message = { 
        app_id: "9afa0071-9129-4cc2-9b03-e540943c136e",
        contents: {"en": "English Message"},
        include_player_ids: ["6317a13a-fcb2-4bcf-8361-8e24781cb49a","65cdde25-0721-4336-aef5-e1a00281a443"]
        };

        sendNotification(message);

        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        // const snapshot = await admin.database().ref('/messages').push({original: original});
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.send('msg: ' + original);
});


var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic MjA3OGYxYWMtNzRmMi00MjlkLTlkNWUtZGU2ZTRjMjViOThi"
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};
