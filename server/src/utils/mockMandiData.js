// MOCK MANDI DATA SYSTEM - Simulated for hackathon demo purposes

const baseMandiPrices = {
  Tomato:  { base: 25, unit: 'kg', category: 'Vegetables' },
  Potato:  { base: 18, unit: 'kg', category: 'Vegetables' },
  Onion:   { base: 30, unit: 'kg', category: 'Vegetables' },
  Wheat:   { base: 22, unit: 'kg', category: 'Grains' },
  Rice:    { base: 40, unit: 'kg', category: 'Grains' },
  Milk:    { base: 50, unit: 'litre', category: 'Dairy' },
  Mango:   { base: 60, unit: 'kg', category: 'Fruits' },
  Spinach: { base: 20, unit: 'kg', category: 'Vegetables' },
  Carrot:  { base: 28, unit: 'kg', category: 'Vegetables' },
  Apple:   { base: 90, unit: 'kg', category: 'Fruits' },
  Banana:  { base: 35, unit: 'dozen', category: 'Fruits' },
  Garlic:  { base: 80, unit: 'kg', category: 'Vegetables' }
};

const stateMultipliers = {
  Maharashtra: 1.1,
  Punjab: 0.9,
  'Uttar Pradesh': 0.95,
  Gujarat: 1.05,
  Karnataka: 1.08,
  default: 1.0
};

const getDailyFluctuation = () => {
  const seed = new Date().getDate();
  return 1 + (((seed * 7) % 21) - 10) / 100;
};

const getTrend = (fluctuation) => {
  if (fluctuation > 1.05) return 'Rising';
  if (fluctuation < 0.97) return 'Falling';
  return 'Stable';
};

const getDemandLevel = (crop) => {
  const highDemand = ['Tomato', 'Onion', 'Potato', 'Milk'];
  const lowDemand = ['Garlic'];
  if (highDemand.includes(crop)) return 'High';
  if (lowDemand.includes(crop)) return 'Low';
  return 'Medium';
};

const getMandiPrice = (cropName, state = 'default') => {
  const crop = baseMandiPrices[cropName];
  if (!crop) return null;
  const multiplier = stateMultipliers[state] || stateMultipliers.default;
  const fluctuation = getDailyFluctuation();
  const mandiPrice = Math.round(crop.base * multiplier * fluctuation);
  const demand = getDemandLevel(cropName);
  const demandAdjustment = demand === 'High' ? 8 : demand === 'Low' ? -3 : 2;
  const seasonalAdjustment = new Date().getMonth() < 6 ? 3 : -2;
  const suggestedPrice = Math.round(mandiPrice + demandAdjustment + seasonalAdjustment);
  return {
    crop: cropName,
    mandiPrice,
    suggestedPrice,
    unit: crop.unit,
    category: crop.category,
    trend: getTrend(fluctuation),
    demandLevel: demand,
    lastUpdated: new Date().toISOString()
  };
};

const getAllMandiPrices = (state = 'default') => {
  return Object.keys(baseMandiPrices).map(crop => getMandiPrice(crop, state));
};

const getTopGainers = () => {
  return getAllMandiPrices().filter(p => p.trend === 'Rising').slice(0, 4);
};

module.exports = { getMandiPrice, getAllMandiPrices, getTopGainers, getDemandLevel };
