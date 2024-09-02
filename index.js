const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Create an uploads directory if it doesn't exist
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
  },
});

const upload = multer({
  storage: storage,
  limits: { files: 1000 }, // Limit the number of files to 1000
});

// Middleware to measure request handling time
app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1e6; // Convert to milliseconds
    console.log(`${req.method} ${req.originalUrl} - ${duration.toFixed(2)} ms`);
  });

  next();
});

// Serve the index.html file
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to handle image uploads
app.post("/upload", upload.array("images", 1000), (req, res) => {
  try {
    res.status(200).send({
      message: "Images uploaded successfully!",
      files: req.files.map((file) => file.filename),
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while uploading images",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
