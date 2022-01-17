const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET__KEY = process.env.SECRET__KEY
const PORT = 8080;

const customFs = require("./lib/fsdeal");
const students = new customFs("./models/students.json");

const verifyToken =((req,res,next)=>{
  try {
    const { token } = req.headers;
    const {id, name} = jwt.verify(token, SECRET__KEY)
    const users = students.read()
    const findUser = users.find(e => e.id == id)
    if(!findUser){
      res.status(401).send({
        status: 401,
        messge: "User not found"
      })
    } else{
      next()
    }
  } catch(e) {
    console.log(e);
    res.status(401).send({
      status: 401,
      messge: "Invalid token"
    })
  }

})


app.post("/login", express.json(),(req, res) =>{
  const {userName, password} = req.body;
  const users = students.read()
  const findUser = users.find(e => e.userName == userName && e.password == password)
  
  if(!findUser){
    res.status(401).send({
      status: 401,
      messge: "User not found"
    })
  } else {
    const accessToken = jwt.sign({id: findUser.id, name: findUser.userName}, SECRET__KEY,{
      expiresIn: "90s"
    });
    res.json(accessToken)
  }
})

app.get("/myAccount", verifyToken, (req,res)=> {
  const { token } = req.headers;
    const {id, name} = jwt.verify(token, SECRET__KEY)
  const users = students.read()
  const findUser = users.find(e => e.id == id)
  res.json(findUser)
})


app.listen( PORT, console.log("PORT 8080"))