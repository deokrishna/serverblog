import User from '../model/User.js';
import bcrypt from 'bcryptjs';
export const getAllUser = async (req, res,next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(err);
  }
  if(!users){
    return res.status(404).json({message:"No Users Found"});
  }
  return res.status(200).json({users});
};

export const signup = async (req,res,next) => {
  const {name, email, password} = req.body;
  let existingUser;
  try{
      existingUser = await User.findOne({email});
  } catch(err) {
      return console.log(err);
  }
  if(existingUser){
      return res.status(400).json({message: "User already exists! LogIn instead."});
  }
  //create new user
  const hashedPassword= bcrypt.hashSync(password);
  const user = new User({
      name, email, 
      password: hashedPassword,
      blogs: []
  });

  try{
      await user.save();
  } catch(err){
      return console.log(err);
  }
  return res.status(201).json({user}); //created
}

export const login=async(req,res,next)=>{
  const {email,password}=req.body;
  let existinguser;
    try{
        existinguser=await User.findOne({email});
    }catch(err){
        return console.log(err);
    }
    if(!existinguser){
        return res
        .status(404)
        .json({message:`Couldn't find user by this email`});
    }
    const isPasswordCorrect=bcrypt.compareSync(password,existinguser.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message:'Incorrect Password'});
    }
    return res.status(200).json({message:'Login Successfull!! ',user:existinguser});
}