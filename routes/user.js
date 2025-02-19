const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authenticateToken = require('./userAuth.js')

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const {username, email, password, address} = req.body;

        if(username.length <= 4) {
            return res.status(400).json({message : "Username should be at least 5 characters long"});
        }

        const existingUsername = await User.findOne({username: username})

        if(existingUsername) {
            return res.status(400).json({message : "Username already exists"});
        }
        
        const existingEmail = await User.findOne({email: email})

        if(existingEmail) {
            return res.status(400).json({message : "Email already exists"});
        }
        
        if(password.length <= 5) {
            return res.status(400).json({message : "Password should be at least 6 characters long"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, email, password : hashedPassword, address});

        await newUser.save();
        return res.status(200).json({
            message : "User created successfully"
        })

    } catch (error) {
        res.status(500).json({message : "Internal server error"});
    }
})

// Sign in
router.post('/login',async (req, res) => {
    try {
        const {username, password} = req.body;

        const userExists = await User.findOne({username});
        if(!userExists) {
            return res.status(400).json({message : "User not found"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message : "Invalid password"});
        }
        
        const authClaims = {
            id : userExists._id,
            username : userExists.username,
            role : userExists.role
        }
        const token = jwt.sign({authClaims}, process.env.SECRET_KEY, {expiresIn: '30d'});
        return res.status(200).json({
            id : userExists._id, role : userExists.role, token
        })
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
    }
})

// get user information
router.get('/get-user-information', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id).select('-password');
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
    }
})

router.put('/update-address', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address}, {new: true});
        return res.status(200).json({
            msg : "Address updated successfully"
        });
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
    }
})

module.exports = router;