var express = require('express');
var router = express.Router();
var cors = require('cors');
var apn = require('apn');

var apnProviderSDconfig = {
    key: __dirname + '/sdkey_20200620.pem', // Key file path
    passphrase: process.env.pass,
    cert: __dirname + '/sdcert_20200620.pem', // String or Buffer of CA data to use for the TLS connection
    production: true,
    enhanced: true
};
    
var apnProviderSDDevconfig = {
    key: __dirname + '/sdkey_20200620.pem', // Key file path
    passphrase: process.env.pass,
    cert: __dirname + '/sdcert_20200620.pem', // String or Buffer of CA data to use for the TLS connection
    production: false,
    enhanced: true
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/apn', cors(), (req, res) => {
    if (!req.body.secret_sauce) {
        res.json({error: true, message: 'api key not provided'});

    }  else {
        var provider;
        
        if (req.body.dev) {
            provider = new apn.Provider(apnProviderSDDevconfig);
        } else {
            provider = new apn.Provider(apnProviderSDconfig);
        }

        let token = req.body.token;
        let alert = req.body.alert;
        let payload = req.body.payload;
        let topic = req.body.topic;
        let badge = req.body.badge;
        let deviceToken = token;
        
        //console.log('sending push to token: ' + deviceToken);

        var note = new apn.Notification();

        //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = badge;
        note.sound = "ping.aiff";
        note.alert = alert;
        note.payload = payload;
        note.topic = topic;

        provider.send(note, deviceToken).then((result) => {
            res.json({success: true, result: result});
        });
        
        provider.shutdown();
    }

});

router.get('/androidlink', cors(), (req, res) => {
    var androidLinks = ['asbury.dpsk12.org'];
    res.json({result: androidLinks});
})

module.exports = router;
