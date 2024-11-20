const express=require("express");
const app=express();
require("dotenv").config();
const cors=require("cors");
const moment =require("moment");
const axios=require("axios")
const port=process.env.PORT;


app.listen(port,()=>{
    console.log(`app is listening on local host port ${port}`)
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res) =>{
    res.send("<h2>Its going down now </h2>")
})



app.post("/stk_push",(req,res)=>{
   const phone=req.body.phone;
   const amount=req.body.amount;
   res.json({phone,amount});
   
});

async function getAccessToken(){
    const consumerKey=process.env.CONSUMER_KEY;
    const consumerSecret=process.env.CONSUMER_SECRET;
    const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth= "Basic " + new Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

    try{
        const response=await axios.get (url,{
            headers:{
                Authorization:auth,
            },
        });
        const accessToken=response.data.access_token;
        return accessToken
        


    }catch(err){
        console.log(err.message)
    }
}

app.get("/access_token",(req,res)=>{
    getAccessToken()
    .then(accessToken =>{
        res.send(`congratulations your access token is ${accessToken}`)
    })
})

app.get("/stk_push",(req,res)=>{
    getAccessToken()
    .then(accessToken=>{
        //declare the passwords stored in the environment variables
        const auth="Bearer " +accessToken;
        const timestamp=moment().format("YYYYMMDDHHmmss");
        const businessShortCode=process.env.BUSINESS_SHORT_CODE;
        const mpesaPassKey=process.env.MPESA_PASS_KEY;
        const url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const amount=1;
        const phone =process.env.PHONE_NUMBER

        //generate base 64 encoded password from the businesscode, passkey and timestamp
        const password=new Buffer.from(businessShortCode+mpesaPassKey+timestamp).toString("base64");
        console.log(`base 64 encoded password ${password}`);
        const binaryData=new Buffer.from(password,"base64").toString();
        console.log(` decoded binary data from the password ${binaryData}`);

        const payload={
            BusinessShortCode:businessShortCode,
            Password:password,
            Timestamp:timestamp,
            TransactionType:"CustomerPayBillOnline",
            Amount:amount,
            PartyA:phone,
            PartyB:businessShortCode,
            PhoneNumber:phone,
            CallBackURL:"https://dd3d-105-160-22-207.ngrok-free.app/callback",
            AccountReference:"Superior Online MerChants",
            TransactionDesc:`Pay Superior Merchants ${amount}`
        }
    
    axios.post(url,payload,{headers:{Authorization:auth}})
})
.then((response)=>{
    res.send("Request has been successfully sent you will be prompted to enter your password")
})
.catch(err=>{
    console.log(err.message);
})
    
   
})


