const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:8081',
    credentials:true,
    methods:"GET, POST, PATCH, DELETE"
}))
app.use('/api',routes.router);


main().catch((err)=>console.log(err))

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/node_auth");
    console.log("Database Connected")
}


app.listen(8000,()=>{
    console.log("server started at port 8000");
});