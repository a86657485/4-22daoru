import { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Send, CheckCircle2, FileText, Printer, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AppState } from '@/src/App';
import { mealSalesData, wasteData } from '@/src/data/mockData';

interface Props {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Step4Report({ appState, updateAppState }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = appState.step2Analysis.trim().length > 0 && appState.step3Analysis.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    const msg = `小绿，我已经提交了最终的数据分析报告！\n\n【套餐销量分析】：${appState.step2Analysis}\n\n【厨余趋势预测】：${appState.step3Analysis}\n\n请你作为数据科学组的导师，给我的整份报告做一个综合评价，并打个分吧！`;
    window.dispatchEvent(new CustomEvent('summon-ai', { detail: { message: msg, autoSend: true } }));
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">分析报告发布</h2>
          <p className="text-slate-400 mt-2">预览你的数据分析报告，确认无误后提交给绿叶配餐公司。</p>
        </div>
        
        {submitted && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 px-4 py-2 rounded-lg flex items-center space-x-2">
            <CheckCircle2 size={18} />
            <span className="font-medium">报告已成功发送至绿叶配餐公司</span>
          </motion.div>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-slate-100 text-slate-900 border-slate-300 relative">
        {/* A4 Paper Styling */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        
        <CardHeader className="border-b border-slate-200 pb-6 pt-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900">绿叶配餐优化建议报告</CardTitle>
              <p className="text-slate-500 mt-2 font-medium">数据科学组 · 四年级见习分析师</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-slate-400">REPORT ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              <p className="text-sm font-mono text-slate-400">DATE: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 flex-1 overflow-y-auto space-y-10">
          
          {/* Section 1 */}
          <section>
            <h3 className="text-xl font-bold text-indigo-900 border-l-4 border-indigo-600 pl-3 mb-4">1. 套餐销量分析</h3>
            <div className="flex flex-col gap-4">
              <div className="h-64 w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mealSalesData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Bar dataKey="sales" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">分析师洞察</h4>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('summon-ai', { detail: { message: '小绿，你能帮我点评一下我的“套餐销量分析”写得怎么样吗？有什么可以改进的地方？' } }))}
                    className="text-xs flex items-center text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-100 hover:bg-indigo-200 px-2 py-1.5 rounded-md"
                  >
                    <Sparkles size={14} className="mr-1" />
                    让小绿点评
                  </button>
                </div>
                <textarea
                  value={appState.step2Analysis}
                  onChange={(e) => updateAppState({ step2Analysis: e.target.value })}
                  placeholder="请在此输入或修改你的套餐销量分析..."
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-400 resize-none focus:outline-none py-1 text-slate-700 leading-relaxed min-h-[100px] transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-xl font-bold text-cyan-900 border-l-4 border-cyan-600 pl-3 mb-4">2. 厨余垃圾趋势预测</h3>
            <div className="flex flex-col gap-4">
              <div className="h-64 w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wasteData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line type="step" dataKey="target" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">分析师洞察</h4>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('summon-ai', { detail: { message: '小绿，你能帮我点评一下我的“厨余垃圾趋势预测”写得怎么样吗？有什么可以改进的地方？' } }))}
                    className="text-xs flex items-center text-cyan-700 hover:text-cyan-800 transition-colors bg-cyan-100 hover:bg-cyan-200 px-2 py-1.5 rounded-md"
                  >
                    <Sparkles size={14} className="mr-1" />
                    让小绿点评
                  </button>
                </div>
                <textarea
                  value={appState.step3Analysis}
                  onChange={(e) => updateAppState({ step3Analysis: e.target.value })}
                  placeholder="请在此输入或修改你的厨余垃圾趋势预测..."
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-400 resize-none focus:outline-none py-1 text-slate-700 leading-relaxed min-h-[100px] transition-colors"
                />
              </div>
            </div>
          </section>

        </CardContent>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-4">
          <Button variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-200">
            <Printer className="mr-2 w-4 h-4" />
            打印预览
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitted || !canSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="mr-2 w-4 h-4" />
                已提交
              </>
            ) : (
              <>
                <Send className="mr-2 w-4 h-4" />
                {!canSubmit ? '请先填写分析师洞察' : '一键提交报告'}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
