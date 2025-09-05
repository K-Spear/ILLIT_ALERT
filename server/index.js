const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for the frontend to access the API
app.use(cors());
app.use(express.json());

const PositionSide = {
  LONG: 'LONG',
  SHORT: 'SHORT',
};

// Helper function to parse numbers from strings like "1,234.56 USDT"
const parseNumber = (text) => {
    if (typeof text !== 'string') return 0;
    // Removes all characters except digits, dots, and hyphens
    return parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
};


app.get('/api/positions/:encryptedUid', async (req, res) => {
  const { encryptedUid } = req.params;
  if (!encryptedUid) {
    return res.status(400).json({ message: 'Encrypted UID is required' });
  }

  const url = `https://www.binance.com/en/futures-activity/leaderboard/user/um?encryptedUid=${encryptedUid}`;
  
  try {
    const { data } = await axios.get(url, {
        // Use a common user-agent to avoid being blocked
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const $ = cheerio.load(data);
    const positions = [];

    // --- Scraper Logic ---
    // NOTE: These selectors are based on the Binance UI structure as of the time of writing.
    // They are FRAGILE and may break if Binance updates its website layout.
    // This is the container for each open position.
    $('.css-1g2wq66').each((i, el) => {
        try {
            const symbol = $(el).find('.css-vurnku').text().replace('Perp', '').trim();
            
            const pnlText = $(el).find('.css-1vni3t').text(); // e.g., "+1,234.56 ( +0.12% )"
            const pnl = parseNumber(pnlText.split('(')[0]);
            const roe = parseNumber(pnlText.split('(')[1]);

            const size = parseNumber($(el).find('.css-1wp6m5m div').eq(0).text());
            const entryPrice = parseNumber($(el).find('.css-1wp6m5m div').eq(1).text());
            const markPrice = parseNumber($(el).find('.css-1wp6m5m div').eq(2).text());

            const leverageText = $(el).find('.css-10c0myg').text();
            const leverage = parseNumber(leverageText);

            // Determine position side based on PNL color. This is a common heuristic.
            const isProfitPositive = $(el).find('.css-1vni3t').hasClass('css-7o2g7r'); // Green color class for profit
            const side = isProfitPositive ? PositionSide.LONG : PositionSide.SHORT;

            if(symbol) {
                 positions.push({
                    symbol,
                    pnl,
                    roe,
                    size,
                    entryPrice,
                    markPrice,
                    leverage,
                    side,
                });
            }
        } catch (e) {
            console.error('Error parsing a position element:', e);
        }
    });

    res.json(positions);

  } catch (error) {
    console.error('Error fetching or scraping Binance data:', error.message);
    res.status(500).json({ message: 'Failed to fetch or scrape data from Binance.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
