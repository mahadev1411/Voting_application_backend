const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const router = express.Router();

let model;

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI({
  apiKey: "AIzaSyAZbzCS6K5pP2nQTrvVFpEs3hdI5znVHDE",
});

try {
  model = genAI.getGenerativeModel({ model: "models/text-bison-001" }); // Ensure this model is valid
  console.log("Model initialized successfully.");
} catch (err) {
  console.error("Error initializing model:", err.message || err);
}

// Helper function to generate content
const generate = async (prompt) => {
  try {
    if (!model) {
      throw new Error("Model is not initialized.");
    }

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string.");
    }

    console.log("Request to generateContent:", { prompt });

    // Direct call to generate content, make sure `prompt` is passed properly
    const result = await model.generateContent({
      prompt: prompt,  // Ensure it's an object with `prompt`
      temperature: 0.7, // Optional creativity control
      maxOutputTokens: 200, // Optional length limit
    });

    console.log("Generated result:", result); // Log the full result

    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].output; // Return the first candidate response
    } else {
      throw new Error("No candidates returned.");
    }
  } catch (err) {
    console.error("Error generating content:", err.message || err);
    throw err;
  }
};

// Define the route for content generation (GET method)
router.get("/content", async (req, res) => {
  try {
    const { question } = req.query; // Extract `question` from the query parameters

    if (!question) {
      return res.status(400).json({ error: "Question is required as a query parameter." });
    }

    const answer = await generate(question); // Generate the content
    res.status(200).json({ answer }); // Return the answer as JSON
  } catch (err) {
    console.error("Error in /content route:", err.message || err);
    res.status(500).json({
      error: err.message || "An unexpected error occurred.",
    });
  }
});

app.use("/ai", router);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
