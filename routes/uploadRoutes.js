// routes/upload.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'bus-images',
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cloudinary upload failed' });
  }
});

module.exports = router;
