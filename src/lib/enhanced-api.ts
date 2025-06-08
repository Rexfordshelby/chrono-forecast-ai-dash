
import { supabase } from '@/integrations/supabase/client';
import { fetchStockData, generateAIPrediction, StockData } from './api';

export async function getOrCreatePrediction(symbol: string): Promise<any> {
  try {
    // Check if we have a recent prediction for this symbol
    const { data: existingPrediction, error: fetchError } = await supabase
      .from('predictions')
      .select('*')
      .eq('symbol', symbol)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingPrediction && !fetchError) {
      return existingPrediction;
    }

    // Generate new prediction if none exists or expired
    const stockData = await fetchStockData(symbol);
    const aiPrediction = generateAIPrediction(stockData);

    // Store the new prediction in the database
    const { data: newPrediction, error: insertError } = await supabase
      .from('predictions')
      .insert({
        symbol,
        direction: aiPrediction.direction,
        confidence: aiPrediction.confidence,
        target_price: parseFloat(aiPrediction.targetPrice),
        reasoning: aiPrediction.reasoning,
        sentiment: aiPrediction.sentiment,
        actual_outcome: 'PENDING'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing prediction:', insertError);
      return aiPrediction; // Return generated prediction even if storage fails
    }

    return newPrediction;
  } catch (error) {
    console.error('Error in getOrCreatePrediction:', error);
    // Fallback to local generation
    const stockData = await fetchStockData(symbol);
    return generateAIPrediction(stockData);
  }
}

export async function updatePredictionOutcome(predictionId: string, actualDirection: 'UP' | 'DOWN') {
  try {
    const { error } = await supabase
      .from('predictions')
      .update({ actual_outcome: actualDirection })
      .eq('id', predictionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating prediction outcome:', error);
  }
}

// Enhanced stock data with more sophisticated analysis
export async function getEnhancedStockData(symbol: string): Promise<StockData & { prediction?: any }> {
  try {
    const [stockData, prediction] = await Promise.all([
      fetchStockData(symbol),
      getOrCreatePrediction(symbol)
    ]);

    return {
      ...stockData,
      prediction
    };
  } catch (error) {
    console.error('Error fetching enhanced stock data:', error);
    const stockData = await fetchStockData(symbol);
    return stockData;
  }
}
