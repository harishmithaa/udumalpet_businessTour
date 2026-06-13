const express = require('express');
const router = express.Router();
const UpdateSubscriber = require('../models/UpdateSubscriber');
const { protect, admin } = require('../middleware/auth');

// @desc    Subscribe to updates (Name, Mobile, Area)
// @route   POST /api/update-subscribers/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { name, mobile, area } = req.body;

    if (!name || !mobile || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, mobile number, and area.',
      });
    }

    // Save locally in MongoDB first to ensure no data is lost
    const subscriber = await UpdateSubscriber.create({
      name,
      mobile,
      area,
    });

    // Sync with Google Sheet in the background if configured
    const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    let sheetSynced = false;
    let sheetError = null;

    if (sheetUrl) {
      try {
        console.log('Sending sync request to Google Sheets Web App...');
        const response = await fetch(sheetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, mobile, area }),
        });

        const textBody = await response.text();
        console.log('Google Sheets Web App HTTP Status:', response.status);
        console.log('Google Sheets Web App Raw Body:', textBody);

        let result = null;
        try {
          result = JSON.parse(textBody);
        } catch (e) {
          console.error('Failed to parse Google Sheets response as JSON');
        }

        if (result && (result.success || result.status === 'success' || result.message === 'Row appended successfully!')) {
          sheetSynced = true;
          console.log('Google Sheet sync successful!');
        } else {
          sheetError = 'Response reported failure';
          console.error('Google Sheet sync reported failure:', result);
        }
      } catch (err) {
        console.error('Google Sheet syncing failed:', err.message);
        sheetError = err.message;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to UBT updates!',
      data: subscriber,
      sheetSynced,
      ...(sheetError && { sheetError }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all update subscribers
// @route   GET /api/update-subscribers
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const subscribers = await UpdateSubscriber.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
