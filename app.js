const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"))
app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", (req,res)=> {
    const firstName = req.body.fName ;
    const lastName = req.body.lName ;
    const email = req.body.email ;
    const data = {
        members :[
            {
                email_address: email,
                status:"subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/a302cf0bae"
    const option = {
        method: "POST",
        auth: "sangkhuudev:aa7b5a2c2b88447bd85f03bf0814da9b-us7"
    }
    const request = https.request(url, option, (response)=> {
        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", (req,res)=>{
    res.redirect("/") ;
})

// heroku server : process.env.PORT
const PORT =  process.env.PORT || 3000 ;
app.listen(PORT, ()=>{
    console.log("Server is running on port 3000")
})



// API key : aa7b5a2c2b88447bd85f03bf0814da9b-us7
// Audiance id : a302cf0bae