 import User from "../src/models/User.js";
 import FriendRequest from "../src/models/FriendRequest.js";
export async function getRecommendedUsers (req,res){
 try{
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
        $and:[
            {_id:{$ne: currentUserId}}, // exclude current user
            {_id: {$nin: currentUser.friends}}, // exclude current user's friends
            {isOnboarded:true},
        ]
    })
    res.status(200).json(recommendedUsers);
 }catch(error){
     console.log("Error in getRecommendedUsers controller",error.message);
     res.status(500).json({message:`Internal server error`});
 }
}

export async function getMyFriends(req,res){
  try{
    const user = await User.findById(req.user.id)
    .select("friends")
    .populate("friends","fullName profilePic nativeLanguage learningLanguage");
   res.status(200).json(user.friends); // we are Gone return the user.friends with the populated fields.

  }catch(error){
  console.log("Error in getMyFriends controller",error.message);
  res.status(500).json({message:`Internal Server error`});
  }
}


export async  function sendFriendRequest(req,res){

    try{
 const myId = req.user.id;
 const {id:recipientId}=req.params;

 if(myId==recipientId){ // To Avoid sending request to yourself.
    return res.status(400).json({message:`You can't send friend request to yourself!!`});
 }

 const recipient = await User.findById(recipientId);
 if(!recipient){
     return res.status(404).json({message:"recipient not found."});
 }
 // if you and recipient are already a friend
  if(recipient.friends.includes(myId)){
     return res.status(400).json({message:"You are already friends with the user."});
  }

// if you and user already exist friend request
const existingRequest = await FriendRequest.findOne({
     $or:[
        {sender:myId,recipient:recipientId},
        {sender:recipientId,recipient:myId},
],
});
 if(existingRequest){
     return res.status(400).json({message:"A friend request exists between you and this user."})
 }

 const friendRequest = await FriendRequest.create({
    sender:myId,
    recipient:recipientId,
 });

 res.status(201).json(friendRequest);

    }catch(error){
  console.log("Error in sending FriendRequest controller",error.message);
  req.status(500).json({message:`Internal Server Error.`})
    }
}

export async function acceptFriendRequest (req,res){
   try{
   const {id:requestId} = req.params;
   const friendRequest = await FriendRequest.findById(requestId);

   if(!friendRequest){
    return res.status(404).json({message:"Friend request not found"})
   }

   //For verifying the current user as recipient
   if(friendRequest.recipient.toString()!=req.user.id){
    return res.status(403).json({message:"You are not authorized to accept the request."})
   }

   friendRequest.status = "accepted";
   await friendRequest.save();
  
   // FOR updating the friend's list of the both of the users.
  // $addToSet is the method to add in array only if it don't already exists.

   await User.findByIdAndUpdate(friendRequest.sender,{
    $addToSet:{friends:friendRequest.recipient},
   });
 
   await User.findByIdAndUpdate(friendRequest.recipient,{
    $addToSet:{friends:friendRequest.sender},
   });
 res.status(200).json({message:"Friend request accepted"});
   }catch(error){
  console.log("Error in acceptFriendRequest controller",error.message);
  res.status(500).json({message:`Internal Server Error.`});
   } 
}


// especially for the notification page like to show the requests which are pending sent by other and also the friend requests accepted by other sent by you .
export async function getFriendRequests(req,res){
     try{
       const incomingReqs = await FriendRequest.find({
        recipient:req.user.id,
        status:"pending",
       }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

       const acceptedReqs = await FriendRequest.find({
        sender:req.user.id,
        status:"accepted",
       }).populate("recipient","fullName profilePic");

       res.status(200).json({incomingReqs , acceptedReqs});
     }catch(error){
       console.log("Error in getPendingFriendRequests controller",error.message);
       res.status(500).json({message:`Internal Server Error`});
     }
}


export async function getOutgoingFriendReqs(req,res){
    try{
      const outgoingRequests = await FriendRequest.find({
        sender:req.user.id,
        status:"pending",
      }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
      res.status(200).json({outgoingRequests});
    }catch(error){
        console.log("Error in getOutgoingFriendReqs controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}