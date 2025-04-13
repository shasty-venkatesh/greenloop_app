const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5002;
const cron = require('node-cron');
const axios = require('axios'); 
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/wasteloop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
const ScrapRateSchema = new mongoose.Schema({
  type: String,
  price: Number,
  image: String
});
const ScrapRate = mongoose.model('ScrapRate', ScrapRateSchema);
const demandSchema = new mongoose.Schema({
  scrapType: String,
  companyName: String,
  quantityKg: Number,
  createdAt: { type: Date, default: Date.now }
});

const Demand = mongoose.model('Demand', demandSchema);
app.get('/scraprates', async (req, res) => {
  try {
    const rates = await ScrapRate.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scrap rates' });
  }
});
app.post('/demand', async (req, res) => {
  try {
    console.log('Received demand:', req.body);
    const { scrapType, companyName, quantityKg } = req.body;

    const newDemand = new Demand({ scrapType, companyName, quantityKg });
    await newDemand.save();

    res.status(201).json({ message: 'Demand posted successfully', data: newDemand });
  } catch (error) {
    console.error('Error saving demand:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}); 
app.get('/demands', async (req, res) => {
  try {
    const allDemands = await Demand.find();
    res.json(allDemands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch demands' });
  }
});

app.get('/adjust-prices', async (req, res) => {
  try {
    const demands = await Demand.aggregate([
      { $group: { _id: "$scrapType", totalDemand: { $sum: "$quantityKg" } } }
    ]);

    console.log("📊 Total Demands:", demands); 
    for (const demand of demands) {
      const scrapType = demand._id;
      const totalDemand = demand.totalDemand;
  
      const scrapRate = await ScrapRate.findOne({ type: scrapType });
      if (scrapRate) {
        let newPrice = scrapRate.price; 
        if (totalDemand > 1000) {
          newPrice = (scrapRate.price+(scrapRate.price * 0.10)).toFixed(2); 
        } 
        await ScrapRate.updateOne({ type: scrapType }, { price: newPrice });
        console.log(`✅ Updated price for ${scrapType}: ₹${newPrice}`);
      } else {
        console.log(`❌ Scrap type "${scrapType}" not found in ScrapRate.`);
      }
    }

    res.json({ message: 'Prices adjusted based on demand' });
  } catch (err) {
    console.error('❌ Error adjusting prices:', err);
    res.status(500).json({ error: 'Failed to adjust prices' });
  }
});

app.post('/insertscraprates', async (req, res) => {
  const scrapRatesData = [
    { type: "Iron", price: 52.37, image: "https://example.com/iron.png" },
    { type: "Copper", price: 516.07, image: "https://example.com/copper.png" },
    { type: "Plastic", price: 2.84, image: "https://example.com/plastic.png" },
    { type: "Aluminium", price: 158.66, image: "https://example.com/aluminium.png" },
    { type: "Glass", price: 19.03, image: "https://example.com/glass.png" },
    { type: "Steel", price: 35.16, image: "https://example.com/steel.png" },
    { type: "Catalytic Converter", price: 284.53, image: "https://example.com/catalytic_converter.png" },
    { type: "Brass", price: 560.11, image: "https://example.com/brass.png" },
    { type: "Stainless Steel", price: 213.33, image: "https://example.com/stainless_steel.png" },
    { type: "Silver", price: 92521.9, image: "https://example.com/silver.png" },
    { type: "Old Battery", price: 1491.78, image: "https://example.com/battery.png" },
    { type: "Old Raddi Paper", price: 8.44, image: "https://example.com/paper.png" },
    { type: "Wooden", price: 9.44999, image: "https://example.com/wooden.png" },
    { type: "Hair", price: 1504.99, image: "https://example.com/hair.png" },
    { type: "Old Cloth Fabric", price: 30.48, image: "https://example.com/cloth.png" },
    { type: "E-waste", price: 108.19, image: "https://example.com/ewaste.png" }
  ];

  try {
    await ScrapRate.insertMany(scrapRatesData);
    res.json({ message: 'Scrap rates inserted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert scrap rates' });
  }
});
app.listen(port, () => {
  console.log(`✅ Scrap Rates & Demand API running on http://localhost:${port}`);
});
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🕛 Running daily price adjustment...');
    const response = await axios.get('http://localhost:5002/adjust-prices');
    console.log('✅ Price adjustment response:', response.data);
  } catch (error) {
    console.error('❌ Error in scheduled price adjustment:', error.message);
  }
});