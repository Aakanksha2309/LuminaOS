import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Delhi';
    
    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'WeatherAPI key not configured' },
        { status: 500 }
      );
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || 'City not found' },
        { status: 404 }
      );
    }

    // Transform WeatherAPI data to match the existing structure
    const weatherData = {
      temp: Math.round(data.current.temp_c),
      feels_like: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      max_temp: Math.round(data.current.temp_c), // WeatherAPI current doesn't have max/min in current endpoint
      min_temp: Math.round(data.current.temp_c),
      cloud_pct: data.current.cloud,
      wind_speed: Math.round(data.current.wind_kph * 0.277778), // Convert km/h to m/s
      wind_degrees: data.current.wind_degree || 0
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 