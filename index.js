const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const nodemailer = require('nodemailer');


const app = express();

'use strict';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'it@camcolt.com',
        pass: 'Camcolt2017'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from:"it@camcolt.com", // sender address
    to: 'd.kostrzewa@iceo.co', // list of receivers
    subject: 'Camcolt Error', // Subject line
    /*text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body*/
};


setInterval(function () {
    console.log(new Date())
},60000);
setInterval(checkError,3600000);

    function checkError() {
        console.log("checking");

        var options = {
            host: 'camcolt.com',
        };

        http.get(options, function(res) {
            console.log("Got response: " + res.statusCode);
            if(parseInt(res.statusCode) >=300 && parseInt(res.statusCode <= 600)){
                mailOptions.text = "STATUS CODE: " +res.statusCode.toString();
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
            }
            res.on("data", function(chunk) {
               // console.log("BODY: " + chunk);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            mailOptions.text = e.message.toString();
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });


        const wssStream = new WebSocket("wss://stream.camcolt.com:8443/call");
        const wssChat = new WebSocket("wss://chat.camcolt.com:8081/socket");


        wssChat.on('connection', function connection(ws, req) {

        });

        wssChat.on("error", function (err) {
           // console.log(err);
            console.log("SEND EMAIL");
            // send mail with defined transport object
            mailOptions.text = err.toString();
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });


        wssStream.on('connection', function connection(ws, req) {

            console.log(location);
            /* ws.on('message', function incoming(message) {
                 console.log('received: %s', message);
             });*/

        });
        wssStream.on("error", function (err) {
           // console.log(err);
            console.log("SEND EMAIL");
            //console.log(this.url);
           mailOptions.html =err.toString() +  "<br> URL: " + this.url;
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });
    }




app.listen(process.env.PORT || 1234, function listening() {
    console.log('Listening on %d');
});