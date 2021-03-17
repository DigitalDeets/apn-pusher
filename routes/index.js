var express = require('express');
var router = express.Router();
var cors = require('cors');
var apn = require('apn');

var apnProviderSDconfig = {
    key: __dirname + '/sdkey_20210720.pem', // Key file path
    passphrase: process.env.pass,
    cert: __dirname + '/sdcert_20210720.pem', // String or Buffer of CA data to use for the TLS connection
    production: true
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/apn', cors(), (req, res) => {
    if (!req.body.secret_sauce) {
        res.json({success: false, error: true, message: 'api key not provided'});

    }  else {
        let provider = new apn.Provider(apnProviderSDconfig);

        let alert = req.body.alert;
        let payload = req.body.payload;
        let topic = req.body.topic;
        let badge = req.body.badge;
        let deviceToken = req.body.token;
        
        let note = new apn.Notification();

        //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = badge;
        note.sound = "ping.aiff";
        note.alert = alert;
        note.payload = payload;
        note.topic = topic;

        provider.send(note, deviceToken).then((result) => {
            provider.shutdown();
            res.status(200).json({success: true, result: result});
        });
    }
});

router.post('/apn-test', cors(), (req, res) => {
    if (!req.body.secret_sauce) {
        res.json({success: false, error: true, message: 'api key not provided'});

    }  else {
        let provider = new apn.Provider(apnProviderSDconfig);

        let alert = req.body.alert;
        let payload = req.body.payload;
        let topic = req.body.topic;
        let badge = req.body.badge;
        let deviceToken = req.body.token;

        let note = new apn.Notification();

        //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = badge;
        note.sound = "ping.aiff";
        note.alert = alert;
        note.payload = payload;
        note.topic = topic;

        provider.send(note, deviceToken).then((result) => {
            provider.shutdown();
            console.log(result);
            res.status(200).json({success: true, result: result});
        }); 
    }
});

module.exports = router;