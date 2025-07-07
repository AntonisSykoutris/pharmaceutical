import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenAIModels() {
  try {
    const response = await openai.models.list();
    return response.data;
  } catch (error) {
    console.error('Error fetching OpenAI models:', error);
    throw error;
  }
}
