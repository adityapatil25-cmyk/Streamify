import User from "../src/models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../src/lib/stream.js";

export async function signup(req,res){

   const {fullName,email,password} = req.body; // include  expresss.json for the getting data in the json format.
   /* Firstly we will fill our details and click on the signup button then that signup button will
   send the request to the endpoint /api/auth/signup and then we will create the user in the database 
   once the user is created in the database then we will generate the JWT token which we will be sending back to the user in the 
   form of the cookies so that when next time user logins through the email and passsword then server can believe that the user is already authenticated.*/
   
   try{
    if(!email || !password || !fullName){
      return res.status(400).json({message:`All fields are required`});
    }

    if(password.length<6){
      return res.status(400).json({message:`Password must be of atleast 6 characters.`});
    }

    const emailRegrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
;
    if(!emailRegrex.test(email)){
      return res.status(400).json({message:`Invalid email format`});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:`Email already Exists,please use a different one`});
    }

    const idx = Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email:email,
      fullName:fullName,
      password:password,
      profilePic:randomAvatar,
    });
   try{
    await upsertStreamUser({
      id : newUser._id.toString(),
      name : newUser.fullName,
      image : newUser.profilePic || "",
    })
    console.log(`stream user created for ${newUser.fullName}`);
  }catch(error){
    console.log("Error creating Stream user:",error);
  }

    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
      expiresIn:"365d"
    })

    res.cookie("jwt",token,{
       maxAge:365*24*60*60*1000,
       httpOnly:true, // prevent XSS attack
     // sameSite:"strict", prevent CSRF attacks
     sameSite:"lax",
      secure:process.env.NODE_ENV==="production", // prevent http requests
    })

    res.status(201).json({success:true , user:newUser});

   }catch(error){

      console.log("Error in signup controller",error);
      res.status(500).json({message:`Internal server error.`});
   }

}

export async function login(req,res){
    try{
      const {email,password} = req.body ;

      if(!email || !password){
        return res.status(400).json({message:`All Fields are required`});
      }

     const user = await User.findOne({email});
     if(!user){
      return res.status(401).json({message:`Invalid email or password`});
     }
   
     const isPasswordCorrect = await user.matchPassword(password);
     if(!isPasswordCorrect){
      return res.status(401).json({message:`Invalid email or Password`});
     }

     const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
      expiresIn:"365d"
    })

    res.cookie("jwt",token,{
       maxAge:365*24*60*60*1000,
       httpOnly:true, // prevent XSS attack
     // sameSite:"strict", prevent CSRF attacks
     sameSite:"lax",
      secure:process.env.NODE_ENV==="production", // prevent http requests
    })

    res.status(200).json({success:true,user}); // user is returned bcz all it's details will be returned then.

    }catch(error){
       console.log("Error in login controller",error.message);
       res.status(500).json({message:`Internal Server Error`});
    }
}


export function logout(req,res){
     res.clearCookie("jwt");
     res.status(200).json({success:true,message:"Logout Successful"});
}


export async function onboard(req,res){

  try{
    const userId = req.user._id;

    const {fullName,bio,nativeLanguage,learningLanguage,location,profilePic}= req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({
        message:"All Fields are required",
        missingFields:[
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativelanguage",
          !learningLanguage && "learninglanguage",
          !location && "location",
        ]
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{
       fullName,
       bio,
       nativeLanguage,
       learningLanguage,
       location,
       profilePic,
       isOnboarded : true,
    },{new:true});

   if(!updatedUser){
    return res.status(404).json({message:"User not found"});
   }
  
   try{
    await upsertStreamUser({
      id:updatedUser._id.toString(),
      name:updatedUser.fullName,
      image : updatedUser.profilePic || ""
    });
    console.log(`Stream user is updated after onboarding for ${updatedUser.fullName}`);
   }catch(StreamError){
      console.log(`Error updating stream user during onboarding:`,StreamError.message);
   }
   res.status(200).json({success:true , user:updatedUser});
  }catch(error){
   
    console.log("Onboarding error:",error);
    res.status(500).json({message:"Internal server error"});
  }
}