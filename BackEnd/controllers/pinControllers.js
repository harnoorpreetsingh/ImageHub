import getDataURL from "../utils/urlGenerator.js"; // Import the getDataURL function
import cloudinary from "cloudinary"; // Import Cloudinary
import { Pin } from "../models/pinModel.js"; // Import the Pin model

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to create a new pin
export const createPin = async (req, res) => {
  try {
    const { title, pin } = req.body; // Extract title and pin from request body

    const file = req.file; // Get the file from the request
    const fileUrl = getDataURL(file); // Convert file to Data URL

    // Upload the file to Cloudinary
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    // Create a new pin in the database
    await Pin.create({
      title,
      pin,
      image: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
      owner: req.user._id, // Set the owner to the logged-in user
    });

    // Send a success response
    res.json({
      message: "Pin Created",
    });
  } catch (error) {
    // Send an error response
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAllPins = async (req, res) => {

try {
  
 const pins = await Pin.find().sort({createdAt: -1})

 res.json(pins)

} catch (error) {
  
}

} 

export const getSinglePin = async (req, res) => {

  try {
    
   const pin = await Pin.findById(req.params.id).populate("owner", "-password")
  
   res.json(pin)
  
  } catch (error) {
    
  }
  
  } 


  export const commentOnPin = async (req, res) => {
    try {
      const pin = await Pin.findById(req.params.id);
  
      if (!pin) {
        return res.status(400).json({ message: "No Pin with this ID" });
      }
  
      pin.comments.push({
        user:req.user.id,
        name:req.user.name,
        comment:req.body.comment,
      });
  
      await pin.save();
  
      res.json({ message: "Comment Added" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  
  export const deleteComment = async (req, res) => {

try {
  
  const pin = await Pin.findById(req.params.id);
  
  if (!pin) {
    return res.status(400).json({ message: "No Pin with this ID" });


  }

  if(!req.query.commentId) return res.status(404).json({
    message: "Give Comment ID"
  })

  const commentIndex= pin.comments.findIndex(
    (item)=> item._id.toString()=== req.query.commentId.toString()    
  )


  if(commentIndex ===-1){
    return res.status(400).json({ message: "Comment not found" });
  }


  const comment =  pin.comments[commentIndex]

  if(comment.user.toString()===req.user._id.toString()){
    pin.comments.splice(commentIndex, 1);

    await pin.save()

    return res.json({
      message: "Comment Deleted"
    })
  }

  else{
    return res.status(403).json({ message: "You are not owner of this comment" });
  }


} catch (error) {
  
}

  }

  export const deletePin = async (req, res) => {

try {
  
  const pin = await Pin.findById(req.params.id);
  
  if (!pin) {
    return res.status(400).json({ message: "No Pin with this ID" });
  }

if(pin.owner.toString() !== req.user._id.toString())
  return res.status(403).json({
 message: "Unauthorised"
})

await cloudinary.v2.uploader.destroy(pin.image.id)

await pin.deleteOne()

res.json({
  message: "Pin Deleted"
})

} catch (error) {
  res.status(500).json({ message: "Server error", error: error.message });

}


  }
  

  export const updatePin = async (req, res) => {

try {
  
  const pin = await Pin.findById(req.params.id);
  
  if (!pin) {
    return res.status(400).json({ message: "No Pin with this ID" });
  }

  if(pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
   message: "Unauthorised"
  })

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "Pin Updated"
  })

} catch (error) {
  
}

  }
