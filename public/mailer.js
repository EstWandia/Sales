import express from "express";
import nodemailer from "nodemailer";
const router = express.Router();
import db from '../models/index.js';

const { Solditems, VillageSolditems } = db;

/**
 * Helper: Convert array → JSON_FORCE_OBJECT style
 */
function forceJsonObject(arr) {
    const obj = {};
    arr.forEach((item, i) => {
        obj[i] = item;
    });
    return obj;
}

/**
 * Helper: Send Email
 */
async function sendReceiptEmail(toEmail, subject, htmlContent) {
    try {
        // Configure transporter (replace with your SMTP settings)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS
            }
        });

        await transporter.sendMail({
            from: '"Charity Receipts" <estherwandiangetha@gmail.com>',
            to: toEmail,
            subject,
            html: htmlContent
        });

        console.log(`Email sent to ${toEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// =========================
// Email Receipt Endpoint
// =========================
router.get('/email-transaction', async (req, res) => {
    try {
        const { transactionId, email, type } = req.query;

        if (!transactionId || !email) {
            return res.status(400).json({ error: "Missing transactionId or email" });
        }

        const Model = type === "village" ? VillageSolditems : Solditems;
        const items = await Model.findAll({ where: { transaction_id: transactionId } });

        if (!items || items.length === 0) {
            return res.status(404).json({ error: "No items found for this transaction" });
        }

        let total = 0;
        let itemsHtml = "";
        items.forEach(item => {
            itemsHtml += `<li>${item.name} x${item.quantity} @ ${item.price} = ${item.amount}</li>`;
            total += parseFloat(item.amount);
        });

        const htmlContent = `
            <h2>${type === "village" ? "Village Market Receipt" : "Charity Receipt"}</h2>
            <p><b>Transaction:</b> ${transactionId}</p>
            <p><b>Date:</b> ${new Date().toLocaleString()}</p>
            <hr>
            <ul>${itemsHtml}</ul>
            <hr>
            <h3>Total: ${total.toFixed(2)}</h3>
            <p>Thank you for your support!</p>
        `;

        // Send Email
        await sendReceiptEmail(email, "Your Receipt", htmlContent);

        res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("Email transaction error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
