const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
exports.registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const userExists = await User.findOne({
            email
        });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({

            name,

            email,

            password: hashedPassword

        });

        res.status(201).json({

            _id: user._id,

            name: user.name,

            email: user.email,

            token: generateToken(user._id)

        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        res.status(200).json({

            success: true,

            _id: user._id,

            name: user.name,

            email: user.email,

            token: generateToken(user._id)

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getMe = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json(user);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};