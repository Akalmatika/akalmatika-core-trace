import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, X, Minimize2, Maximize2, MessageCircle } from "lucide-react";
import { geminiService, ChatMessage } from "../engine/geminiService";

interface AITutorChatProps {
  expression: string;
  studentAns: number;
  correctAns: number;
  bugCode: string | null;
  onClose?: () => void;
}

export default function AITutorChat({ expression, studentAns, correctAns, bugCode, onClose }: AITutorChatProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize context and get first response
    geminiService.initChatContext(expression, studentAns, correctAns, bugCode);
    
    setMessages([{ 
      role: "model", 
      text: `Soal saat ini: ${expression}. Ada yang bisa Kak Akalmatika bantu jelaskan?` 
    }]);
    setIsLoading(false);
  }, [expression, studentAns, correctAns, bugCode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    
    setIsLoading(true);
    const aiResponse = await geminiService.sendMessage(userMsg);
    setMessages(prev => [...prev, { role: "model", text: aiResponse }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-fadeIn">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-3 md:p-4 rounded-full shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center relative group"
        >
          <Sparkles size={24} className="animate-pulse" />
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-bounce"></span>
          
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
            Tanya Kak Akalmatika
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-50 w-full md:w-80 lg:w-96 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-indigo-100 flex flex-col overflow-hidden font-sans animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-800 rounded-lg">
            <Sparkles size={16} className="text-indigo-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Kak Akalmatika</h3>
            <span className="text-[10px] text-indigo-300 uppercase tracking-wider block">Tutor AI (Gemini 2.5)</span>
          </div>
        </div>
        <div className="flex gap-1 text-indigo-300">
          <button onClick={() => setIsOpen(false)} className="hover:text-white cursor-pointer transition-colors p-2 -m-1"><Minimize2 size={16} /></button>
          {onClose && <button onClick={onClose} className="hover:text-white cursor-pointer transition-colors p-2 -m-1"><X size={16} /></button>}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="h-64 md:h-[400px] p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs md:text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-xs'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-[85%] rounded-2xl p-3 text-xs md:text-sm leading-relaxed bg-white border border-slate-200 text-slate-500 rounded-bl-none shadow-xs flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya Kak Akalmatika di sini..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
