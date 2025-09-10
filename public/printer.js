import express from "express";
const router = express.Router();
import db from '../models/index.js';

const {Solditems} =db;

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

// =========================
// Print Receipt Endpoint
// =========================
router.get('/print-data-fixed', (req, res) => {
    const { id, type } = req.query;

    const printData = [];

    // Title
    printData.push({
        type: 0, // text
        content: 'NODE.JS TEST RECEIPT',
        bold: 1,
        align: 1, // center
        format: 3 // double width
    });

    // Empty line
    printData.push({ type: 0, content: ' ', bold: 0, align: 0 });

    // Order info
    printData.push({ type: 0, content: `Order #: ${id || 'NOD' + Date.now()}`, bold: 0, align: 0 });
    printData.push({ type: 0, content: `Type: ${type || 'Test'}`, bold: 0, align: 0 });
    printData.push({ type: 0, content: `Date: ${new Date().toLocaleString()}`, bold: 0, align: 0 });

    // Empty line
    printData.push({ type: 0, content: ' ', bold: 0, align: 0 });

    // Items
    const items = [
        'Product A - $10.00',
        'Product B - $15.50',
        'Product C - $8.75'
    ];
    items.forEach(item => {
        printData.push({ type: 0, content: item, bold: 0, align: 0 });
    });

    // Empty line
    printData.push({ type: 0, content: ' ', bold: 0, align: 0 });

    // Total
    printData.push({ type: 0, content: 'TOTAL: $34.25', bold: 1, align: 2 });

    // Empty line
    printData.push({ type: 0, content: ' ', bold: 0, align: 0 });

    // Barcode
    printData.push({
        type: 2,
        value: '1234567890123',
        width: 100,
        height: 50,
        align: 1
    });

    // QR code
    printData.push({
        type: 3,
        value: 'https://example.com/order/123',
        size: 40,
        align: 1
    });

    // Thank you
    printData.push({
        type: 0,
        content: 'Thank you for your business!',
        bold: 1,
        align: 1
    });

    //Return JSON_FORCE_OBJECT
    res.json(forceJsonObject(printData));
});

// =========================
// Print HTML Endpoint
// =========================
router.get('/print-html-fixed', (req, res) => {
    const printData = [];

    printData.push({
        type: 4, // HTML content
        content: `<center><span style="font-weight:bold; font-size:20px;">NODE.JS HTML TEST</span></center><br />
                  <p>This is a test receipt generated from Node.js server</p>
                  <p>Server Date: ${new Date().toLocaleString()}</p>`
    });

    //Return JSON_FORCE_OBJECT
    res.json(forceJsonObject(printData));
});
router.get('/print-transaction', async (req, res) => {
    try {
        const { transactionId } = req.query;

        if (!transactionId) {
            return res.status(400).json({ error: "Missing transactionId" });
        }

        const items = await Solditems.findAll({ where: { transaction_id: transactionId } });
        if (!items || items.length === 0) {
            return res.status(404).json({ error: "No items found for this transaction" });
        }

        const printData = [];

        // Title
        printData.push({
            type: 0,
            content: 'CHARITY RECEIPT',
            bold: 1,
            align: 1,
            format: 3
        });

        // Empty line
        printData.push({ type: 0, content: ' ', bold: 0, align: 0 });

        // Transaction ID
        printData.push({
            type: 0,
            content: `Transaction: ${transactionId}`,
            bold: 0,
            align: 0
        });

        printData.push({
            type: 0,
            content: `Date: ${new Date().toLocaleString()}`,
            bold: 0,
            align: 0
        });

        // Divider
        printData.push({ type: 0, content: '---------------------------', bold: 0, align: 0 });

        // Items
        let total = 0;
        items.forEach(item => {
            const line = `${item.name} x${item.quantity} @ ${item.price} = ${item.amount}`;
            printData.push({ type: 0, content: line, bold: 0, align: 0 });
            total += parseFloat(item.amount);
        });

        // Divider
        printData.push({ type: 0, content: '---------------------------', bold: 0, align: 0 });

        // Total
        printData.push({
            type: 0,
            content: `TOTAL: ${total.toFixed(2)}`,
            bold: 1,
            align: 2
        });

         printData.push({
        type: 2,
        value: '1234567890123',
        width: 100,
        height: 50,
        align: 1
    });

    // QR code
    printData.push({
        type: 3,
        value: 'https://example.com/order/123',
        size: 40,
        align: 1
    });

        // Thank you
        printData.push({
            type: 0,
            content: 'Thank you Charity values you!',
            bold: 1,
            align: 1
        });

        res.json(forceJsonObject(printData));

    } catch (err) {
        console.error("Print transaction error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;