import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const VEDIC_API_URL = 'https://vedicscriptures.github.io/';

// Helper function to fetch data from Vedic API
const fetchFromVedicAPI = async (endpoint) => {
  try {
    const response = await axios.get(`${VEDIC_API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from Vedic API:', error);
    throw error;
  }
};

// Analyze user query and fetch relevant advice
const getVedicAdvice = async (query) => {
  // Example logic to map user queries to chapters/shlokas
  if (query.toLowerCase().includes('stress') || query.toLowerCase().includes('anxiety')) {
    return await fetchFromVedicAPI('/slok/2/14/'); // Bhagavad Gita 2.14
  } else if (query.toLowerCase().includes('anger')) {
    return await fetchFromVedicAPI('/slok/2/63/'); // Bhagavad Gita 2.63
  } else if (query.toLowerCase().includes('purpose') || query.toLowerCase().includes('dharma')) {
    return await fetchFromVedicAPI('/slok/2/47/'); // Bhagavad Gita 2.47
  } else {
    // Default: Fetch a random shlok from a random chapter
    const randomChapter = Math.floor(Math.random() * 18) + 1; // 18 chapters
    const randomShlok = Math.floor(Math.random() * 20) + 1; // Assume 20 shlokas per chapter
    return await fetchFromVedicAPI(`/slok/${randomChapter}/${randomShlok}/`);
  }
};

// Endpoint to handle chatbot requests
app.post('/chat', async (req, res) => {
    const { message } = req.body;
  
    try {
      // Fetch relevant advice from Vedic API
      const vedicAdvice = await getVedicAdvice(message);
  
      // Extract only the necessary fields
      const response = {
        slok: vedicAdvice.slok,
        translation: vedicAdvice.tej.ht, // Use the "tej" translation (or any other)
      };
  
      res.json({ response });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ response: 'Sorry, something went wrong.' });
    }
  });

// Endpoint to fetch starter topics
app.get('/starter-topics', (req, res) => {
  const starterTopics = [
    { id: 1, title: 'Dealing with Stress', query: 'How to handle stress?' },
    { id: 2, title: 'Finding Purpose', query: 'What is my purpose in life?' },
    { id: 3, title: 'Overcoming Anger', query: 'How to control anger?' },
    { id: 4, title: 'Understanding Dharma', query: 'What is dharma?' },
  ];
  res.json(starterTopics);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});