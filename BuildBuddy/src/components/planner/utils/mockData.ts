export const locationCoords: Record<string, { lat: number; lng: number }> = {
  "Mountain View Restaurant": { lat: 37.3861, lng: -122.0839 },
  "Eagle Peak Trail": { lat: 37.7993, lng: -121.9991 },
  "Local Airport": { lat: 37.6213, lng: -122.3790 },
  "Beach City": { lat: 33.8850, lng: -118.4085 }
};

export const mockWeather: Record<string, { temp: string; condition: string; icon: string }> = {
  "Eagle Peak Trail": {
    temp: "22°C",
    condition: "Sunny",
    icon: "☀️"
  },
  "Beach City": {
    temp: "28°C",
    condition: "Partly Cloudy",
    icon: "⛅"
  },
  "Mountain View Restaurant": {
    temp: "24°C",
    condition: "Clear",
    icon: "🌤️"
  },
  "Local Airport": {
    temp: "20°C",
    condition: "Light Rain",
    icon: "🌦️"
  }
}; 