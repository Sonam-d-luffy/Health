import dotenv from "dotenv";
import OTP from "../models/otpModel.js";

dotenv.config();

export const sendEmail = async (to, subject, otp) => {
  try {
    console.log("Sending email to:", to);

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL,
          },
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
          textContent: `Your OTP is ${otp}. It will expire in 2 minutes.`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", data);
      throw new Error(data.message || "Brevo email failed");
    }

    console.log("Email sent:", data);

    return data;

  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
        email: normalizedEmail,
        verified: false
    });

    if (!otpRecord) {
        return {
            success: false,
            message: 'OTP not found. Please request a new OTP.'
        };
    }

    if (new Date() > otpRecord.expiresAt) {

        await OTP.deleteOne({
            _id: otpRecord._id
        });

        return {
            success: false,
            message: 'OTP has expired. Please request a new OTP.'
        };
    }

    if (otpRecord.attempts >= 5) {

        await OTP.deleteOne({
            _id: otpRecord._id
        });

        return {
            success: false,
            message: 'Too many incorrect attempts. Please request a new OTP.'
        };
    }
    if (String(otpRecord.otp) !== String(otp)) {

        otpRecord.attempts += 1;

        await otpRecord.save();

        return {
            success: false,
            message: 'Invalid OTP',
            attemptsLeft: 5 - otpRecord.attempts
        };
    }

    otpRecord.verified = true;

    await otpRecord.save();

    return {
        success: true,
        message: 'OTP verified successfully'
    };
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendStatusEmail = async ( to, name, status, message = "" ) => 
  { try { console.log("Sending status email to:", to); 
    let subject = "";
     let heading = "";
      let statusMessage = "";
       if (status.toLowerCase() === "Approved") 
        { subject = "Your Application Has Been Approved"; 
          heading = "Application Approved"; 
          statusMessage = message || "Congratulations! Your application has been approved."; 
        } else if (status.toLowerCase() === "Rejected") 
          { subject = "Update Regarding Your Application";
             heading = "Application Rejected"; statusMessage = message || "We regret to inform you that your application has been rejected.";

           } else if (status.toLowerCase() === "Pending") 
            { subject = "Your Application Status"; heading = "Application Under Review"; statusMessage = message || "Your application is currently under review.";

             } else { 
              subject = "Application Status Update"; 
              heading = "Application Status Update"; statusMessage = message || `Your application status has been updated to ${status}.`; } const response = await fetch( "https://api.brevo.com/v3/smtp/email", 
                { method: "POST", headers:
                   { accept: "application/json", "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", }, 
                   body: JSON.stringify({ sender: { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL, }, 
                    to: [ { email: to, name: name, }, ], subject: subject, textContent: ` Hello ${name}, ${heading} ${statusMessage} Current Status: ${status} Thank you, ${process.env.BREVO_SENDER_NAME} `, }), } );
                     const data = await response.json(); if (!response.ok) { console.error("Brevo Status Email Error:", data); 
                      throw new Error( data.message || "Status email failed" ); 
                    } console.log("Status email sent successfully:", data); return data; }
                     catch (error) {
                       console.error("Status Email Error:", error); throw error; 
                      }
                     };