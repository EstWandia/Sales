// printer.js
import express from "express";
const router = express.Router();

router.get('/print-data', (req, res) => {
   // ... your printData logic ...
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
        printData.push({
            type: 0,
            content: ' ',
            bold: 0,
            align: 0
        });

        // Order info
        printData.push({
            type: 0,
            content: `Order #: ${id || 'NOD' + Date.now()}`,
            bold: 0,
            align: 0
        });

        printData.push({
            type: 0,
            content: `Type: ${type || 'Test'}`,
            bold: 0,
            align: 0
        });

        printData.push({
            type: 0,
            content: `Date: ${new Date().toLocaleString()}`,
            bold: 0,
            align: 0
        });

        // Empty line
        printData.push({
            type: 0,
            content: ' ',
            bold: 0,
            align: 0
        });

        // Items
        const items = [
            'Product A - $10.00',
            'Product B - $15.50',
            'Product C - $8.75'
        ];

        items.forEach(item => {
            printData.push({
                type: 0,
                content: item,
                bold: 0,
                align: 0
            });
        });

        // Empty line
        printData.push({
            type: 0,
            content: ' ',
            bold: 0,
            align: 0
        });

        // Total
        printData.push({
            type: 0,
            content: 'TOTAL: $34.25',
            bold: 1,
            align: 2 // right
        });

        // Empty line
        printData.push({
            type: 0,
            content: ' ',
            bold: 0,
            align: 0
        });

        // Barcode
        printData.push({
            type: 2, // barcode
            value: '1234567890123',
            width: 100,
            height: 50,
            align: 1 // center
        });

        // QR code
        printData.push({
            type: 3, // QR code
            value: 'https://example.com/order/123',
            size: 40,
            align: 1 // center
        });

        // Thank you message
        printData.push({
            type: 0,
            content: 'Thank you for your business!',
            bold: 1,
            align: 1 // center
        });

        res.json(printData);
    });


router.get('/print-html', (req, res) => {
   // ... your HTML print logic ...
    const printData = [];

        printData.push({
            type: 4, // HTML content
            content: `<center><span style="font-weight:bold; font-size:20px;">NODE.JS HTML TEST</span></center><br />
                      <p>This is a test receipt generated from Node.js server</p>
                      <p>Server Date: ${new Date().toLocaleString()}</p>`
        });

   res.json(printData);
});

export default router;
