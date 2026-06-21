const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/validation');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
    const { error } = registerValidation(req.body);
    if (error) {
        res.status(400);
        return next(new Error(error.details[0].message));
    }

    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            return next(new Error('Invalid user data'));
        }
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    const { error } = loginValidation(req.body);
    if (error) {
        res.status(400);
        return next(new Error(error.details[0].message));
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (err) {
        next(err);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404);
            return next(new Error('User not found'));
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};