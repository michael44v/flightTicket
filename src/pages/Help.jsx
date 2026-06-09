import { useState } from 'react';
import { Send, User, Bot, HelpCircle } from 'lucide-react';

const Help = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! Welcome to SkyBridge Support. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simple bot logic
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't quite understand. Could you please rephrase that? You can ask about 'prices', 'installments', or 'West Virginia'.";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('price')) {
        botResponse = "All our flight prices are premium and start from $1,400. This ensures a world-class experience on every journey.";
      } else if (lowerInput.includes('installment') || lowerInput.includes('split')) {
        botResponse = "You can split your payment into 3 equal installments. Please note that a delayed fee of $400 applies if an installment is more than 7 days overdue.";
      } else if (lowerInput.includes('west virginia') || lowerInput.includes('wv') || lowerInput.includes('crw')) {
        botResponse = "We offer premium routes to Charleston, West Virginia (CRW). Check our home page to book your trip to the Mountain State!";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = "Hello! I am your SkyBridge assistant. How can I assist with your travel plans today?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-sky-navy tracking-tighter mb-4 uppercase">
            Help <span className="text-sky-red italic">Center</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">24/7 Support for your premium journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-black/5">
              <h3 className="text-sm font-black text-sky-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                <HelpCircle size={18} className="text-sky-red" /> Common Topics
              </h3>
              <div className="space-y-4">
                {['Booking & Prices', 'Payment Plans', 'Baggage Policy', 'Visa Requirements'].map((topic, i) => (
                  <button key={i} className="w-full text-left p-4 rounded-2xl bg-gray-50 hover:bg-sky-navy hover:text-white transition-all text-xs font-bold uppercase tracking-wider border border-transparent">
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-sky-navy rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-xl font-black mb-4">Contact Us</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">If our chatbot can't help, our agents are standing by.</p>
              <div className="space-y-2 text-sm font-bold">
                <p>support@skybridge.tr</p>
                <p>+90 212 444 0 759</p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-sky-navy p-6 flex items-center gap-4 border-b border-white/10">
               <div className="w-12 h-12 rounded-2xl bg-sky-red flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                  <Bot size={24} />
               </div>
               <div>
                  <h3 className="text-white font-black text-lg leading-none">SkyBot</h3>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                  </p>
               </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50/50">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-sky-navy text-white' : 'bg-sky-red text-white'}`}>
                          {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                       </div>
                       <div className={`p-4 rounded-[24px] text-sm font-medium shadow-sm ${m.role === 'user' ? 'bg-sky-navy text-white rounded-tr-none' : 'bg-white text-sky-navy border border-gray-100 rounded-tl-none'}`}>
                          {m.text}
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-gray-100">
               <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about prices, installments..."
                    className="flex-grow bg-gray-50 border-2 border-transparent focus:border-sky-red rounded-2xl px-6 py-4 outline-none font-bold text-sky-navy transition-all text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-sky-red text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
