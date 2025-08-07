import ChatInterface from './ChatInterface';

export default function TextGenerator() {
  return (
    <ChatInterface
      heroName="Jarvis"
      heroIcon="🤖"
      heroTitle="Iron Man's AI Assistant - Ready to help with any task"
      placeholder="Ask me anything... I can write, explain, create, or help with any task!"
      endpoint="/ai/generate-text"
      requestKey="prompt"
    />
  );
}