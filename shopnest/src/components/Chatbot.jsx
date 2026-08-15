import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm NestAI ✨, your smart shopping assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsTyping(true);

    try {
      if (!API_KEY) {
        setTimeout(() => {
          setMessages(prev => [...prev, { text: "I'm currently in basic mode because my AI brain (API Key) isn't connected! But you can browse our amazing products on the home page.", isBot: true }]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are NestAI, ShopNest's intelligent shopping assistant powered by Google Gemini. ShopNest is a Flipkart-style marketplace with Electronics, Men's Fashion, Women's Fashion, and Jewellery. Help users find products, track orders, compare items, suggest gifts. Be concise, friendly, and helpful. Use emojis. If asked about specific prices or availability, suggest browsing the store. User says: ${userMessage}`;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { text: responseText, isBot: true }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Oops, I ran into a little glitch! Let's try that again. 😅", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-dark-800 border border-dark-700 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] max-h-[80vh] overflow-hidden">
          <div className="bg-dark-900 border-b border-dark-700 p-4 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="text-white font-bold text-lg flex items-center gap-2">NestAI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-dark-900/50 scrollbar-thin">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-dark-700 text-gray-200 rounded-tl-none border border-dark-600 prose prose-invert prose-sm max-w-none' : 'bg-accent text-white rounded-tr-none'}`}>
                  {msg.isBot ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-700 p-3 rounded-2xl rounded-tl-none border border-dark-600 flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-dark-900 border-t border-dark-700">
            <div className="flex flex-wrap gap-2 mb-3">
              {['Find me a gift', 'Track my order', 'Return policy'].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="text-xs bg-dark-800 border border-dark-600 text-gray-300 px-3 py-1.5 rounded-full hover:bg-dark-700 hover:text-white transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask NestAI anything..."
                className="w-full bg-dark-800 border border-dark-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2 p-1.5 bg-accent text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 group relative"
        >
          <Sparkles className="h-6 w-6 absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
