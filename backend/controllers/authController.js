const User = require('../models/User')
const jwt = require("jsonwebtoken");


//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: "5d"});
}


//Register User
exports.registerUser = async (req,res) => {
    // if (!req.body) {
    //     return res.status(400).json({ message: "Request body is missing" });
    // }
    const { fullName, email, password, profileImageUrl } = req.body || {};
    
    //validation: check for missing fields 
    if (!fullName || !email || !password){
        return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"});
    }
    try{
        //check if email already exists
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: "Email đã tồn tại"});
        }

        //Create the user 
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
        .status(500)
        .json({message: "Error registering user", error: err.message});
    }
}

//Login User
exports.loginUser = async (req,res) => {
    const {email, password} = req.body || {};
    if (!email || !password){
        return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"});
    }
    try{
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message: "Mật khẩu hoặc email không hợp lệ"});
        }
        
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }catch (err){
        res
        .status(500)
        .json({message: "Error registering user", error: err.message});
    }
}


//Get User Info
exports.getUserInfo = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message: "Không tìm thấy người dùng"});
        }

        res.status(200).json(user);
    }catch (err) {
        res
        .status(500)
        .json({message: "Error registering user", error: err.message});
    }
}