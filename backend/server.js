// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Helper: Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
};

// Helper: Extract text from image
const extractTextFromImage = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text;
};

// POST /upload-and-summarize
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const description = req.body.description || "No description provided.";
  console.log(description)
  if (!file) return res.status(400).json({ error: "No file uploaded." });
  const isPDF = file.mimetype === "application/pdf";

  try {
    const text = isPDF
      ? await extractTextFromPDF(file.path)
      : await extractTextFromImage(file.path);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${text}\n\n${description} \n\nSummarize the above text.`
                }
              ]
            }
          ]
        }
      );
      

    const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned.";
    res.json({ summary });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to extract or summarize." });
  }
});

const path = require("path");

const downloadFileFromURL = async (url, isPDF = true) => {
  const fileName = `${Date.now()}-${isPDF ? "file.pdf" : "image.png"}`;
  const filePath = path.join(__dirname, "uploads", fileName);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
};
app.post("/generate-flashcard", async (req, res) => {
  const { title, description, file} = req.body;
  console.log(title, description, file);

  if (!file) return res.status(400).json({ error: "No file uploaded." });
 // Detect content type via HEAD request
const headResponse = await axios.head(file);
const contentType = headResponse.headers['content-type'];
const isPDF = contentType === 'application/pdf';

  try {
    const downloadedFilePath = await downloadFileFromURL(file, isPDF);

    const te = isPDF
      ? await extractTextFromPDF(downloadedFilePath)
      : await extractTextFromImage(downloadedFilePath);
    console.log(te);

    const prompt = `Generate 5 medium to hard question flashcards (question and answer pairs) for the following content:
Title: ${title}
Description: ${description}
file content: ${te}

Respond ONLY in the following JSON format:
[
  { "question": "Question 1 here", "answer": "Answer 1 here" },
  { "question": "Question 2 here", "answer": "Answer 2 here" },
  ...
]`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Generated text:", text);

    // Remove potential ```json or ``` wrappers
    const cleaned = text.replace(/```json|```/g, "").trim();

    let flashcards = JSON.parse(cleaned);

    // Validate: flashcards should be an array with objects containing question & answer
    if (!Array.isArray(flashcards) || flashcards.length === 0 || !flashcards[0].question) {
      return res.status(400).json({
        error: "Incomplete or invalid flashcards received.",
        raw: cleaned,
      });
    }

    res.json(flashcards);
  } catch (err) {
    console.error("Error generating flashcards:", err.message);
    res.status(500).json({
      error: "Failed to generate flashcards.",
      message: err.message,
    });
  }

});

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
