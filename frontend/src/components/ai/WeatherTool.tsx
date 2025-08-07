import ChatInterface from './ChatInterface';

export default function WeatherTool() {
  return (
    <ChatInterface
      heroName="Storm"
      heroIcon="🌤️"
      heroTitle="Weather Controller - I can sense the weather anywhere on Earth"
      placeholder="Ask me about the weather in any city... (e.g., 'What's the weather in Nairobi?')"
      endpoint="/ai/weather"
      requestKey="city"
    />
  );
}