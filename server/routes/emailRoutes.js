import express from 'express';
import { sendEmail} from '../controllers/emailController.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { to, url, txt } = req.body;
        const response = await sendEmail(to, url, txt);
        res.status(200).send({ message: response });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
export default router;


