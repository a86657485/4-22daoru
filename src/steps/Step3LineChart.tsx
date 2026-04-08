import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowRight, LineChart as LineChartIcon, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AppState } from '@/src/App';
import { wasteData } from '@/src/data/mockData';

interface Props {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  onNext: () => void;
}

export default function Step3LineChart({ appState, updateAppState, onNext }: Props) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">厨余趋势预测</h2>
          <p className="text-slate-400 mt-2">分析连续 20 天的厨余垃圾数据，寻找隐藏的规律。</p>
        </div>
        
        {chartType === 'bar' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-amber-950/50 border border-amber-900/50 text-amber-400 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm">
            <AlertTriangle size={16} />
            <span>条形图似乎太拥挤了，难以看出趋势</span>
          </motion.div>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">近20天厨余垃圾重量 (kg)</CardTitle>
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'}
            onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
            className="transition-all"
          >
            <LineChartIcon className="mr-2 w-4 h-4" />
            {chartType === 'bar' ? '切换为折线图' : '切回条形图'}
          </Button>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-1 flex flex-col min-h-0 space-y-6">
          <div className="flex-1 min-h-[300px] relative">
            <AnimatePresence mode="wait">
              {chartType === 'bar' ? (
                <motion.div key="bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wasteData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={50} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                      <Bar dataKey="weight" name="实际重量(kg)" fill="#475569" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="控制目标(kg)" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <motion.div key="line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wasteData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={50} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                      <Line type="monotone" dataKey="weight" name="实际重量(kg)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#38bdf8' }} animationDuration={1500} />
                      <Line type="step" dataKey="target" name="控制目标(kg)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: chartType === 'line' ? 1 : 0.5, y: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-cyan-300 flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
                趋势分析与预测
              </label>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('summon-ai', { detail: { message: '小绿，我看到了折线图的起伏，但我不太会写趋势分析和预测，你能帮帮我吗？' } }))}
                className="text-xs flex items-center text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1.5 rounded-md"
              >
                <Sparkles size={14} className="mr-1" />
                让小绿引导我
              </button>
            </div>
            <textarea
              value={appState.step3Analysis}
              onChange={(e) => updateAppState({ step3Analysis: e.target.value })}
              placeholder="折线展示了什么趋势？每周四有何异常？请给出预测和建议。"
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none placeholder:text-slate-600"
            />
          </motion.div>

          <div className="flex justify-end">
            <Button onClick={onNext} disabled={!appState.step3Analysis.trim() || chartType !== 'line'} className="group bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/25">
              生成最终报告
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
