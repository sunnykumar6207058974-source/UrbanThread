import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Hello! I am your VIP UrbanThread Concierge. How can I help you discover trends or track orders today?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let botResponse = "I can help with that! You can check our Flash Sale section for up to 60% OFF or use coupon code LUXE60 at checkout.";
      if (currentQuery.includes('ship') || currentQuery.includes('deliver') || currentQuery.includes('track')) {
        botResponse = "🚚 Orders are dispatched within 2 hours! Free express shipping is automatically applied on orders over $150.";
      } else if (currentQuery.includes('return') || currentQuery.includes('refund')) {
        botResponse = "🔄 We offer a 30-day hassle-free return policy. You can initiate a return from your Account Dashboard under Returns & Refunds.";
      } else if (currentQuery.includes('coupon') || currentQuery.includes('discount')) {
        botResponse = "🎉 Active Promos: LUXE60 (60% OFF), FASHION20 (20% OFF), FLASH50 (50% OFF). Enter code at cart checkout!";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="floating-chat-container">
      {/* Floating Trigger Button */}
      <button
        className={`floating-chat-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Live VIP Support"
        title="Live VIP Customer Support"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        {!isOpen && <span className="online-indicator-dot" />}
      </button>

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="chat-box-panel animate-scale-up">
          <div className="chat-header">
            <div className="bot-info">
              <div className="bot-avatar">
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <h4>VIP Style Assistant</h4>
                <span className="online-text">● Online 24/7</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-row ${m.sender}`}>
                {m.sender === 'bot' && (
                  <div className="mini-bot-icon">
                    <Bot size={14} />
                  </div>
                )}
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="chat-input-bar">
            <input
              type="text"
              placeholder="Ask about size, delivery, or coupons..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
