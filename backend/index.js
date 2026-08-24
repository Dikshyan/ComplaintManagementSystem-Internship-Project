const express = require("express")
const app = express();
const port = 8080;

app.get("/",(req, res)=>{
    res.send("Hello World the server is live")
});

app.listen(port, ()=>{
    console.log(`The server is Listenning in ${port}`);
});


