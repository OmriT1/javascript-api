require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require('puppeteer');
const axios = require('axios'); // Added axios
const fs = require('fs'); // fs is part of Node.js, no need to install
const base64 = require('base-64'); // Added base-64

const app = express();
const PORT = process.env.PORT || 4000;

// Secure token from environment variable
const SECURE_TOKEN = process.env.SECURE_TOKEN;

// Middleware
app.use(bodyParser.text({ type: "text/plain", limit: "50mb" }));

// Function to check token
const checkToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === SECURE_TOKEN) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};

// Root Endpoint
app.get("/", (req, res) => {
    res.send("Uplifted Render Server Up and running");
});

// Execute endpoint (eval code execution)
app.post("/execute", checkToken, (req, res) => {
    const code = req.body;
    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    try {
        // Execute the code
        const result = eval(code);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message, trace: error.stack });
    }
});

// Scrape Endpoint for Puppeteer
app.post("/scrape", checkToken, async (req, res) => {
    let code = req.body;
    const timeout = parseInt(req.query.timeout) || 30000;

    console.log("Raw received code:", code);
    console.log("Code type:", typeof code);
    console.log("Code length:", code.length);

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    try {
        // If code is not a string, stringify it
        if (typeof code !== 'string') {
            code = JSON.stringify(code);
        }

        // Remove any leading/trailing whitespace
        code = code.trim();

        console.log("Processed code:", code);

        const scrapeResult = await new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Scraping operation timed out'));
            }, timeout);

            try {
                console.log("Attempting to evaluate code...");
                const result = await eval(`(async () => { 
                    ${code} 
                })()`);
                clearTimeout(timer);
                resolve(result);
            } catch (error) {
                console.error("Error during code evaluation:", error);
                clearTimeout(timer);
                reject(error);
            }
        });

        console.log("Scrape result:", scrapeResult);
        res.json(scrapeResult);
    } catch (error) {
        console.error("Error in /scrape endpoint:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: error.message, trace: error.stack });
    }
});

// Example endpoint using axios
app.post("/fetch-data", checkToken, async (req, res) => {
    const url = req.body;
    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        const response = await axios.get(url);
        res.json({ data: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Example endpoint using base64 encoding
app.post("/encode", checkToken, (req, res) => {
    const text = req.body;
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    const encodedText = base64.encode(text);
    res.json({ encoded: encodedText });
});

// Example endpoint for saving to file using fs
app.post("/save-to-file", checkToken, (req, res) => {
    const { filename, content } = JSON.parse(req.body);
    if (!filename || !content) {
        return res.status(400).json({ error: "Filename or content missing" });
    }

    fs.writeFile(filename, content, (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save file" });
        }
        res.json({ message: "File saved successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
