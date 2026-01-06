const express = require('express');
const router = express.Router();
const User = require('./models/user'); // Import the User model
//const db=require('./db');
const { authMiddleware, generateToken } = require('./jwt'); // Correct import
const bcrypt=require('bcrypt')
const sendEmail=require('./emailService')
const {loginLimiterLimiter, loginLimiter}=require('./rate-limit')

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    // age check
    if (data.age < 18) {
      return res.status(400).json({ message: "You should be above 18 years to register!!" });
    }

    // role handling (safe)
    let role = "voter";
    if (data.role === "admin") {
      if (!data.adminKey || data.adminKey !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(403).json({ message: "Invalid admin signup key" });
      }
      role = "admin";
    }

    // ✅ don't store adminKey in DB
    const { adminKey, ...userData } = data;

    const newUser = new User({ ...userData, role });
    const savedUser = await newUser.save();

    await sendEmail(
      userData.email,
      "Welcome to the Voting Application",
      `Dear ${userData.name},<br><br>
      You have successfully registered for the voting system.<br>
      You can now participate in elections.<br><br>
      Best Regards,<br>Voting System Team`
    );

    return res.status(200).json({
      message: "Welcome to the voting application. Email sent!",
      savedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "User already exists!! Please login" });
  }
});

// Login route
router.post('/login', loginLimiter ,async (req, res) => {
    try {
        const { aadhar, password } = req.body;

        const user = await User.findOne({ aadhar });

        if(!user)
            return res.status(401).json({error:"invalid username"})

        if ( !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken({ id: user.id });
        res.json({ message:`Hey ${user.name} !! Welcome Back`,token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Profile route (protected)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password route (protected)
router.put('/profile/password', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!(await user.comparePassword(currPassword))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        user.password = newPassword; // Update password
        await user.save();

        console.log("Password updated");
        res.status(200).json({ message: "Password updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

const checkAdmin = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user && user.role === 'admin';
    } catch (err) {
        return false;
    }
};

router.get('/',async (req,res)=>{
    try
    {
        if (!(await checkAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin privileges' });
        }
        const users=await User.find();
        return res.status(200).json(users);
    }
    catch(err)
    {
        return res.status(500).json({message:'please login as admin'});
    }
    
});
module.exports = router;
