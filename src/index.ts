import express from "express";
import { validateEmailAddress, login } from "./locked/user/Login";
import {
    createPost,
    getAccountInfo,
    getLastPost,
    sendFriendRequest,
} from "./locked/user/Account";
import { register } from "./locked/user/Register";
import { postVideo, uploadImageToFirebaseStorage } from "./utils/Firebase";
import multer from "multer";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();
const port = 3000;

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const valid = await validateEmailAddress(email);
        if (valid["result"]["needs_registration"]) {
            res.status(400).json({ error: "Email not found!" });
            return;
        }
        const result = await login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

app.post("/auth/validate-email", async (req, res) => {
    const { email } = req.body;
    try {
        const result = await validateEmailAddress(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

app.get("/user/getAccountInfo", async (req, res) => {
    const { token } = req.query;
    try {
        const result = await getAccountInfo(token as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

app.post("/user/addFriendRequest", async (req, res) => {
    const { username, token } = req.body;
    try {
        const result = await sendFriendRequest(username, token);
        if (result) {
            res.status(200).json({
                message: "Friend request sent successfully",
            });
        } else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

app.post("/user/postMoment", upload.any(), async (req, res) => {
    const { token, userId, caption } = req.body;
    if (!req.files || !Array.isArray(req.files)) {
        res.status(400).json({ error: "No files uploaded" });
        return;
    }
    const moment = req.files[0];
    try {
        if (moment.mimetype.startsWith("image/")) {
            const imageUrl = await uploadImageToFirebaseStorage(
                userId,
                token,
                moment.buffer
            );
            const result = await createPost(token, imageUrl, caption);
            res.status(200).json(result);
        } else if (moment.mimetype.startsWith("video/")) {
            if (moment.size > 10 * 1024 * 1024) {
                res.status(400).json({ error: "Video size exceeds limit" });
                return;
            }
            const resl = await postVideo(
                userId,
                token,
                moment.buffer,
                caption
            );
            res.status(200).json(resl);
        } else {
            res.status(500).json({ error: "Unsupported file type!" });
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Error" });
    }
});

app.get("/user/getLastMoment", async (req, res) => {
    const { token } = req.query;
    try {
        const result = await getLastPost(token as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
