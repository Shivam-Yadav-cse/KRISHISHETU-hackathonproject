const { getMandiPrice, getDemandLevel } = require('./mockMandiData');

// SMART PRICING RECOMMENDATION SYSTEM - Rule-based simulation for hackathon demo
const getPriceRecommendation = (cropName, state = 'default', farmerCost = 0) => {
  const mandiData = getMandiPrice(cropName, state);
  if (!mandiData) {
    return {
      suggestedPrice: farmerCost * 1.3,
      mandiPrice: 0,
      profit: 0,
      recommendation: 'No mandi data available. Price based on estimated cost.',
      demandLevel: 'Medium',
      trend: 'Stable'
    };
  }

  const { mandiPrice, suggestedPrice, trend, demandLevel } = mandiData;

  let recommendation = '';
  if (demandLevel === 'High' && trend === 'Rising') {
    recommendation = `Great time to sell! High demand + rising prices. Sell at ₹${suggestedPrice}/kg for maximum profit.`;
  } else if (demandLevel === 'High') {
    recommendation = `Good demand. Suggested price of ₹${suggestedPrice}/kg ensures competitive profit.`;
  } else if (trend === 'Falling') {
    recommendation = `Prices falling. Consider selling quickly at ₹${suggestedPrice}/kg to avoid loss.`;
  } else {
    recommendation = `Stable market. Price at ₹${suggestedPrice}/kg for fair returns.`;
  }

  const profit = farmerCost > 0 ? suggestedPrice - farmerCost : suggestedPrice - mandiPrice * 0.7;

  return {
    suggestedPrice,
    mandiPrice,
    profit: Math.max(0, Math.round(profit)),
    profitMargin: farmerCost > 0 ? Math.round(((suggestedPrice - farmerCost) / farmerCost) * 100) : 0,
    recommendation,
    demandLevel,
    trend
  };
};

module.exports = { getPriceRecommendation };
