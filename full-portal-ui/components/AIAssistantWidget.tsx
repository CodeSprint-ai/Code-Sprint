import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Terminal, X, Minimize2, Maximize2, MessageSquare } from 'lucide-react';
import { getAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "CodeSprint AI-Core v2.1 initialized. Awaiting query..." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAIResponse(input);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 hover:bg-green-400 text-black rounded-full shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-110 group flex items-center justify-center border-4 border-black/20"
        >
            <div className="relative">
                <Terminal className="w-7 h-7 group-hover:rotate-3 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
            </div>
        </button>
      )}

      {/* Chat Window - Terminal Style */}
      <div className={`fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0c0c0c] border border-green-500/30 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right transform ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="h-14 px-4 bg-green-950/20 border-b border-green-500/20 flex items-center justify-between rounded-t-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20">
                <Bot className="w-4 h-4 text-green-500" />
            </div>
            <div>
                <div className="text-xs font-bold text-white tracking-wide">AI_ASSISTANT</div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-green-500/70 tracking-wider">ONLINE</span>
                </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
             <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-sm bg-gradient-to-b from-black/50 to-black/80 custom-scrollbar">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-zinc-600 mb-1.5 font-bold tracking-widest px-1">
                        {msg.role === 'user' ? 'USER_INPUT' : 'AI_RESPONSE'}
                    </span>
                    <div className={`max-w-[90%] px-4 py-3 rounded-xl border leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-zinc-900 text-zinc-200 border-zinc-800 rounded-tr-none' 
                        : 'bg-green-950/30 text-green-100 border-green-500/20 rounded-tl-none shadow-[0_4px_20px_-4px_rgba(34,197,94,0.1)]'
                    }`}>
                        {msg.role === 'model' && <span className="mr-2 text-green-500 opacity-50 select-none font-bold">{'>'}</span>}
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start">
                    <div className="bg-green-950/20 border border-green-500/10 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-2 font-mono text-xs text-green-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="animate-pulse">PROCESSING_DATA_STREAM...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0c0c0c] border-t border-green-500/20 rounded-b-2xl">
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 py-3 rounded-xl focus-within:border-green-500/40 focus-within:bg-zinc-900 transition-all duration-300">
                <span className="text-green-500 font-mono font-bold text-lg">›</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    placeholder="Execute command or ask query..."
                    spellCheck={false}
                    className="flex-1 bg-transparent border-none outline-none text-green-100 text-sm font-mono placeholder:text-zinc-700"
                />
                <button onClick={handleSend} disabled={!input.trim() || isLoading} className="text-green-500 hover:text-green-400 disabled:opacity-30 transition-colors">
                     <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </>
  );
};