import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error('Gemini API key is not configured');
      return new Response('API key not configured', { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log('Sending request to Gemini:', message);
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response received:', text.substring(0, 100) + '...');

    // Return plain text instead of JSON
    return new Response(text, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return new Response(`Error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 