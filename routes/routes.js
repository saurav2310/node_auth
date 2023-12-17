const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  const result = await user.save();
  const { password, ...data } = await result.toJSON();
  res.status(201).json({data});
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 100,
  });
  res.status(200).json(token);
});

router.get("/user", async (req, res) => {
    try{

  const cookie = req.cookies["jwt"];
  const claims = jwt.verify(cookie,"secret")
  if(!claims){
    return res.status(401).json({
        message: "Unautheticated",
      });
  } 
  const user = await User.findOne({id:claims._id});

  const {password,...data} = await user.toJSON();

  res.status(200).json(data);
  
}catch(err){
    res.status(404).json({message:"Cannot Get Users"});
        
}
});

router.post('/logout',(req,res)=>{
    res.cookie('jwt',"",{maxAge:0})//cookie will expire immediately
    res.json({
        message:"Logout successfully"
    })
})

exports.router = router;
