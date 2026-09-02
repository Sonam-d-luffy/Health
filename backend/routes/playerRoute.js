import express from 'express';
import bcrypt from 'bcrypt';
import Player from '../models/playerModel.js';
import OTP from '../models/otpModel.js';
import { getLocationFromPincode, getCoords } from '../utils/apis.js';
import { sendEmail, generateOTP, verifyOTP } from '../utils/email.js';
import upload from '../middleware/multer.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const {  email } = req.body;

        if ( !email) {
            return res.status(400).json({ message: 'Fill all credentials' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingPlayer = await Player.findOne({ email: normalizedEmail });
        if (existingPlayer) {
            return res.status(400).json({ message: 'Email already registered. Please login.' });
        }

        const otp = generateOTP();

        await OTP.deleteMany({
            email: normalizedEmail,
        });

        await OTP.create({
            email: normalizedEmail,
            otp,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            attempts: 0,
            verified: false
        });

        await sendEmail(
            normalizedEmail,
            'Sign Up OTP',
            otp
        );
console.log(otp)
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            email: normalizedEmail,
            redirect: 'otp'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify-email', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const result = await verifyOTP(
            normalizedEmail,
            otp
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            email: normalizedEmail
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

     
        const existingOTP = await OTP.findOne({
            email: normalizedEmail,
            verified: false
        });

        if (
            existingOTP &&
            existingOTP.createdAt &&
            Date.now() - existingOTP.createdAt.getTime() < 2 * 60 * 1000
        ) {
            return res.status(429).json({
                message: 'Please wait 2 minutes before requesting another OTP'
            });
        }

        const otp = generateOTP();
console.log(otp)
        await OTP.deleteMany({
            email: normalizedEmail,
        });

        await OTP.create({
            email: normalizedEmail,
            otp,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            attempts: 0,
            verified: false
        });

        await sendEmail(
            normalizedEmail,
            'Email Verification OTP',
            `otp`
        );

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});
router.post('/create-player', upload.single('image'), async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            sports,
            pincode,
            gender,
            local
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !sports ||
            !pincode ||
            !gender
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check whether email was verified
        const verifiedOTP = await OTP.findOne({
            email: normalizedEmail,
            verified: true
        });

        if (!verifiedOTP) {
            return res.status(400).json({
                message: 'Please verify your email first'
            });
        }

        // Prevent duplicate player
        const existingPlayer = await Player.findOne({
            email: normalizedEmail
        });

        if (existingPlayer) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        const { state, district } =
            await getLocationFromPincode(pincode);

        const { latitude, longitude } =
            await getCoords(pincode);

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const player = await Player.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,

            sports: sports
                .split(',')
                .map(s => s.trim()),

            gender,

            image: req.file
                ? req.file.path
                : '',

            address: {
                state,
                district,
                local: local || '',
                pincode,
                location: {
                    latitude,
                    longitude
                }
            },

            emailVerified: true
        });

        // OTP no longer needed
        await OTP.deleteMany({
            email: normalizedEmail
        });

        return res.status(201).json({
            success: true,
            message: 'Player created successfully',
            player
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const player = await Player.findOne({
            email: normalizedEmail
        });

        if (!player) {
            return res.status(404).json({
                message: 'Account not found. Please signup first.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            player.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: player._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            playerId: player._id,
            player: player
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});


export default router;