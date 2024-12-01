import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to check for authorized user
const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
   
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        const encryptedToken = getDecryptedToken(token);

        // Verify token with USER secret
        jwt.verify(encryptedToken, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                if (err.message === "invalid signature") {
                    // Try verification with ADMIN secret if USER secret fails
                    return jwt.verify(encryptedToken, process.env.ADMIN_SECRET_KEY, (err, adminUser) => {
                        if (err) {
                            console.error("Token verification error:", err.message);
                            return res.status(403).json({ success: false, message: "Invalid token." });
                        }
                        req.id = adminUser.id;
                        req.isAdmin = true;
                        return next();
                    });
                } else {
                    console.error("JWT Error:", err.message);
                    return res.status(403).json({ success: false, message: "Invalid token." });
                }
            }
            req.id = user.id;
            req.isAdmin = false;
            next();
        });
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({ success: false, message: "An error occurred during authentication." });
    }
};

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
