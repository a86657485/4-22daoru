import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from '../App';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  currentStep: number;
  appState: AppState;
}

const DEEPSEEK_API_KEY = 'sk-eb65e011c69a4e1cb667eecdfce990a8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export default function AICompanion({ currentStep, appState }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好呀！小数据分析师👋 我是你的AI伴学助手“小绿”。准备好和我一起探索数据的奥秘了吗？有什么问题随时问我哦！'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleSummon = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string, autoSend?: boolean }>;
      setIsOpen(true);
      if (customEvent.detail?.message) {
        if (customEvent.detail.autoSend) {
          handleSend(customEvent.detail.message);
        } else {
          setInput(customEvent.detail.message);
        }
      }
    };
    window.addEventListener('summon-ai', handleSummon);
    return () => window.removeEventListener('summon-ai', handleSummon);
  }, []);

  // 当步骤改变时，AI主动发一条提示
  useEffect(() => {
    if (currentStep === 1) return; // 初始不发
    
    let promptMsg = '';
    if (currentStep === 2) promptMsg = '太棒了！我们拿到了全校的真实数据📊。现在请在左侧选择不同的X轴和Y轴，看看哪个套餐最受欢迎？如果遇到困难可以问我哦！';
    if (currentStep === 3) promptMsg = '哇，进入厨余垃圾分析了！🗑️ 条形图是不是有点看不清？试试切换成“折线图”，看看能不能发现哪一天的数据特别高？';
    if (currentStep === 4) promptMsg = '恭喜你来到最后一步！🎉 看看你的分析报告，是不是很有成就感？确认无误就可以点击提交啦！';

    if (promptMsg) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: promptMsg }]);
      if (!isOpen) setIsOpen(true); // 自动打开面板提醒学生
    }
  }, [currentStep]);

  const getSystemPrompt = () => `
你是一个名叫“小绿”的AI伴学智能体，专门辅导四年级学生完成《绿叶配餐公司数据分析》课程。
你的语气要亲切、鼓励、充满童趣，像一个聪明的小助手。
【核心原则】：不要直接给出答案！而是通过提问引导学生自己观察图表和思考。

当前学生正在进行：第 ${currentStep} 步。
- 第1步（数据检索）：引导学生明白为什么“全校ERP报表”比“家长群反馈”或“单班数据”更客观、更准确。
- 第2步（销量对比）：引导学生观察条形图，结合销量、满意度和成本，思考哪个套餐最受欢迎（比如C套餐），哪个应该淘汰（比如D套餐）。
- 第3步（厨余趋势）：引导学生观察折线图，发现“每周四”厨余垃圾增多的规律，并鼓励他们猜测原因（比如周四的菜是不是大家不喜欢？）。
- 第4步（分析报告）：鼓励学生总结发现，表扬他们的分析能力。

请用简短的语言回答，适合四年级学生的阅读理解水平，多用emoji。每次回答控制在100字以内。
`;

  const handleSend = async (overrideText?: any) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: textToSend.trim() };
    const currentMessages = [...messagesRef.current, userMsg];
    
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: getSystemPrompt() },
        ...currentMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse
      }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '哎呀，小绿的信号好像有点不好📶，请稍后再试一次哦！'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform hover:scale-110 z-50"
          >
            <Bot size={28} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-900"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center">
                    AI伴学助手 小绿 <Sparkles className="ml-1 text-yellow-300" size={16} />
                  </h3>
                  <p className="text-indigo-100 text-xs">正在辅导: 第 {currentStep} 步</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center space-x-2">
                    <Loader2 className="animate-spin text-indigo-400" size={16} />
                    <span className="text-slate-400 text-xs">小绿正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex items-end space-x-2 bg-slate-950 border border-slate-700 rounded-xl p-1 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="问问小绿吧..."
                  className="flex-1 bg-transparent text-slate-200 text-sm p-3 max-h-32 min-h-[44px] resize-none focus:outline-none placeholder:text-slate-500"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors mb-0.5 mr-0.5"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-2">
                由 DeepSeek 提供智能支持
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
