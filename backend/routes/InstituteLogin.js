import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Institute from '../models/InstituteModel.js';
import OTP from '../models/otpModel.js';
import upload from '../middleware/multer.js';
import { getLocationFromPincode, getCoords } from '../utils/apis.js';
import { sendEmail, generateOTP, verifyOTP } from '../utils/email.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Fill all credentials'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingInstitute = await Institute.findOne({
            email: normalizedEmail
        });

        if (existingInstitute) {
            return res.status(400).json({
                message: 'Email already registered. Please login.'
            });
        }

        const otp = generateOTP();

        await OTP.deleteMany({
            email: normalizedEmail
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
            'Institute Sign Up OTP',
            otp
        );

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            email: normalizedEmail
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
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
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post(
    '/create-institute',
    upload.fields([
        { name: 'registration', maxCount: 1 },
        { name: 'affiliation', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const {
                name,
                email,
                password,
                phone,
                pincode,
                local,
                registrationNo,
                sports,
                forGirls
            } = req.body;

            if (
                !name ||
                !email ||
                !password ||
                !phone ||
                !pincode ||
                !local ||
                !registrationNo ||
                !sports ||
                !forGirls
            ) {
                return res.status(400).json({
                    message: 'Fill all credentials'
                });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const otpRecord = await OTP.findOne({
                email: normalizedEmail,
                verified: true
            });

            if (!otpRecord) {
                return res.status(400).json({
                    message: 'Please verify your email first'
                });
            }

            const existingInstitute = await Institute.findOne({
                email: normalizedEmail
            });

            if (existingInstitute) {
                return res.status(400).json({
                    message: 'Email already registered'
                });
            }

            const existingRegistration = await Institute.findOne({
                registrationNo
            });

            if (existingRegistration) {
                return res.status(400).json({
                    message: 'Registration number already exists'
                });
            }

            if (
                !req.files?.registration ||
                !req.files?.affiliation ||
                !req.files?.pan ||
                !req.files?.image
            ) {
                return res.status(400).json({
                    message: 'All documents and image are required'
                });
            }

            const { state, district } =
                await getLocationFromPincode(pincode);

            const { latitude, longitude } =
                await getCoords(pincode);

            if (
                latitude === undefined ||
                latitude === null ||
                longitude === undefined ||
                longitude === null
            ) {
                return res.status(400).json({
                    message: 'Could not determine institute location'
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const institute = await Institute.create({
                name,
                registrationNo,
                address: {
                    pincode,
                    state,
                    district,
                    local,
                    location: {
                        type: 'Point',
                        coordinates: [
                            Number(longitude),
                            Number(latitude)
                        ]
                    }
                },
                email: normalizedEmail,
                password: hashedPassword,
                phone,
                docs: {
                    registration:
                        req.files.registration[0].path,
                    affiliation:
                        req.files.affiliation[0].path,
                    pan:
                        req.files.pan[0].path,
                    image:
                        req.files.image[0].path
                },
                sports: sports
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                forGirls
            });

            await OTP.deleteMany({
                email: normalizedEmail
            });

            const token = jwt.sign(
                { id: institute._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                success: true,
                message: 'Institute created successfully',
                institute,
                instituteId: institute._id,
                token
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const institute = await Institute.findOne({
            email: normalizedEmail
        });

        if (!institute) {
            return res.status(404).json({
                message: 'Institute not found. Please signup first.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            institute.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: institute._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            instituteId: institute._id,
            institute
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

export default router;