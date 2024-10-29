import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

// MIDDLEWARE TO CHECK FOR AUTHORIZED USER

const authMiddleware = async (req, res, next) => {
    
    const { token } = req.headers;

    // Check if the token exists
    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        // Decrypt the token
        const encryptedToken = getDecryptedToken(token);

        // Verify the decrypted token
        jwt.verify(encryptedToken, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err.message);
                return res.json({ success: false, message: "Invalid token." });
            }

            // Attach user id to request object
            req.id = user.id;
            next(); // Proceed to the next middleware or route handler
        });
        
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "An error occurred during authentication." });
    }
};

// DECRYPT THE TOKEN
function getDecryptedToken(encryptedToken) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.SECRET_KEY_2);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedToken) {
            throw new Error("Decryption failed");
        }

        return decryptedToken;
    } catch (error) {
        throw new Error("Malformed token or decryption failed");
    }
}

export default authMiddleware;
