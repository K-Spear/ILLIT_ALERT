const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Use a general CORS policy for local development
app.use(cors());
app.use(express.json());

const PositionSide = {
  LONG: 'LONG',
  SHORT: 'SHORT',
};

const scrapePositions = async (encryptedUid) => {
    try {
        const url = `https://www.binance.com/en/futures-activity/leaderboard/user/um?encryptedUid=${encryptedUid}`;
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        };

        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const positions = [];

        // The main container for each position entry has changed.
        const positionRows = $('div.css-1g2wq66').find('div.css-vurnku');
        
        if (positionRows.length === 0) {
            console.log("No position rows found. The page structure might have changed or there are no open positions.");
        }
        
        positionRows.each((index, element) => {
            const row = $(element);
            
            const symbol = row.find('div.css-17f2g5a').text().trim();
            const leverageText = row.find('div.css-1ap568u').text().trim();
            
            const dataFields = row.find('div.css-124ezff > div');
            const sizeText = dataFields.eq(0).text().trim();
            const entryPriceText = dataFields.eq(1).text().trim();
            const markPriceText = dataFields.eq(2).text().trim();
            const pnlAndRoeText = dataFields.eq(4).text().trim();

            // More reliable side detection by checking the color bar class
            const isLong = row.find('div.css-gq4g32').length > 0;
            const isShort = row.find('div.css-1522n2c').length > 0;
            let side = null;
            if (isLong) side = PositionSide.LONG;
            if (isShort) side = PositionSide.SHORT;
            
            if (!symbol || !side) {
                return; // Skip if essential data is missing
            }

            const parseNumber = (str) => {
                if (typeof str !== 'string') return 0;
                return parseFloat(str.replace(/[^0-9.-]/g, '')) || 0;
            }
            
            const pnlMatch = pnlAndRoeText.match(/([+-][\d,]+\.?\d*)/);
            const roeMatch = pnlAndRoeText.match(/\((.+?)%\)/);

            const position = {
                symbol,
                side,
                leverage: parseNumber(leverageText),
                size: parseNumber(sizeText),
                entryPrice: parseNumber(entryPriceText),
                markPrice: parseNumber(markPriceText),
                pnl: pnlMatch ? parseNumber(pnlMatch[1]) : 0,
                roe: roeMatch ? parseNumber(roeMatch[1]) : 0,
            };
            
            positions.push(position);
        });

        return positions;

    } catch (error) {
        console.error('Error during scraping:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
        throw new Error('Failed to fetch or parse data from Binance. The user might not exist, or Binance is blocking the request.');
    }
};


app.get('/api/positions/:encryptedUid', async (req, res) => {
    const { encryptedUid } = req.params;
    if (!encryptedUid) {
        return res.status(400).json({ message: 'Encrypted UID is required' });
    }

    try {
        console.log(`Fetching positions for UID: ${encryptedUid}`);
        const positions = await scrapePositions(encryptedUid);
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
