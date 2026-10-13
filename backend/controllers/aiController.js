const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Robust JSON parser helper that safely handles markdown wrappers or extra whitespace
const extractJson = (text) => {
  if (!text) return null;
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
      } catch (e) {}
    }

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (e) {}
    }
    throw err;
  }
};

// Generates content using the active Gemini model with fallback
const generateWithModelFallback = async (contents) => {
  const models = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  let lastError = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
        },
      });
      return response.text;
    } catch (err) {
      console.warn(`[AI Controller] Model ${model} failed, attempting next available model:`, err.message);
      lastError = err;
    }
  }
  throw lastError;
};

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    const hasExperience = experience !== undefined && experience !== null && experience !== "";
    if (!role || !hasExperience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const rawText = await generateWithModelFallback(prompt);
    const parsedData = extractJson(rawText);

    const questionsArray = Array.isArray(parsedData)
      ? parsedData
      : (parsedData?.questions || parsedData?.data || []);

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      throw new Error("Invalid or empty questions returned by AI model");
    }

    res.status(200).json(questionsArray);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explains a interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);
    const rawText = await generateWithModelFallback(prompt);
    const data = extractJson(rawText);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating concept explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };