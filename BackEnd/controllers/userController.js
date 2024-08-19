import User from "../models/userModel.js"; // Default import for User model
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords
import generateToken from "../utils/generateTokens.js"; // Import token generation utility

// Creating register user API
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Extracting name, email, and password from request body

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Generate token and store in cookie
    generateToken(user._id, res);

    res.status(201).json({
      user,
      message: "User Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Creating login user API
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extracting email and password from request body

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No user with these credentials",
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    // Generate token and store in cookie
    generateToken(user._id, res);
    res.json({
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// To fetch my profile
export const myProfile = async (req, res) => {
  try {
    // Find user by ID from request
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Please Log In",
    });
  }
};

// To fetch other user's profile
export const userProfile = async (req, res) => {
  try {
    // Find user by ID from request parameters and exclude password field
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Follow & unfollow user API
export const followAndUnfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user to follow/unfollow
    const loggedInUser = await User.findById(req.user._id); // Find logged-in user

    if (!user) {
      return res.status(400).json({
        message: "User not found with this id",
      });
    }

    if (user._id.toString() === loggedInUser._id.toString()) {
      return res.status(400).json({
        message: "Can't follow yourself",
      });
    }

    // Check if already followed
    if (user.followers.includes(loggedInUser._id)) {
      const indexFollowing = loggedInUser.following.indexOf(user._id);
      const indexFollowers = user.followers.indexOf(loggedInUser._id);

      // Remove from followers and following
      loggedInUser.following.splice(indexFollowing, 1);
      user.followers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await user.save();

      return res.json({
        message: "User unfollowed",
      });
    } else {
      // Add to followers and following
      loggedInUser.following.push(user._id);
      user.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await user.save();

      return res.json({
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {}
};
