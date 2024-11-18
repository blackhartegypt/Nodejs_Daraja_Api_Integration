const express=require("express");
const app=express();
require("dotenv").config();
const cors=require("cors");
const moment =require("moment");

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