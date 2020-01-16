 // General(/Generic) setup for localhosting via express from here...
 const express = require("express");
 const bodyParser = require("body-parser");
 const request = require("request");
 const app = express();

 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({
   extended: true
 }));
 //...until here

 app.get("/", function(req, res) {
   res.sendFile(__dirname + "/signup.html");
 });

 app.post("/", function(req, res) {
   var firstName = req.body.fName;
   var lastName = req.body.lName;
   var email = req.body.email;

   console.log(firstName, lastName, email);

   //Note that I have removed members:[]
   var data = {
     email_address: email,
     status: "subscribed",
     merge_fields: {
       FNAME: firstName,
       LNAME: lastName
     }
   };

   var jsonData = JSON.stringify(data);

   //https://us4.api.mailchimp.com/3.0/lists/9b70da837f
   //Add members to the end of the url
   var options = {
     url: "https://us4.api.mailchimp.com/3.0/lists/9b70da837f/members",
     method: "POST",
     headers: {
       "Authorization": "SIGALIZ3R 9865f495ac3e1412030cbfd0db01d836-us4"
     },
     body: jsonData
   };

   request(options, function(error, response, body) {
     if (error) {
       res.sendFile(__dirname + "/failure.html");
     } else {
       if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
       } else {
         res.sendFile(__dirname + "/failure.html");
       }
     }
   });

 });

 app.post("/failure", function(req, res) {
   res.redirect("/");
 });

 app.listen(process.env.PORT || 3000, function() {
   console.log("Server is running!");
 });

 //API Key
 //9865f495ac3e1412030cbfd0db01d836-us4

 //Audience ID
 //9b70da837f
