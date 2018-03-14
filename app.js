var express = require('express');
var firebase = require('firebase');
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'naictsofficial@gmail.com',
        pass: '2018EXCOS'
    }
});

firebase.initializeApp({
    apiKey: "AIzaSyDTguh9S4yHIxnResQuymZp0Ha-j2CM-Hs",
    authDomain: "registration-portal.firebaseapp.com",
    databaseURL: "https://registration-portal.firebaseio.com",
    projectId: "registration-portal",
    storageBucket: "registration-portal.appspot.com",
    messagingSenderId: "458038453644"
})

app.post('/email', (req, res) => {
    res.set('Content-Type', 'application/json');
    const msg = req.query.msg
    const sub = req.query.sub

    firebase.database().ref('Registered Students').once('value', (snap) => {
        console.log(snap.val())
        var students = snap.val()

        for (const key in students) {
            if (students.hasOwnProperty(key)) {
                const email = students[key].email;
                const name = students[key].fullname;

                const mailOptions = {
                    from: 'naictsofficial@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: sub, // Subject line
                    html: msg // plain text body
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    } else {
                        console.log(info);
                        res.send(info)
                    }
                });
            }
        }

    })
})

// start the server
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})