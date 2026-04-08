import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, BarChart3, Settings2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AppState } from '@/src/App';
import { mealSalesData } from '@/src/data/mockData';

interface Props {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  onNext: () => void;
}

export default function Step2BarChart({ appState, updateAppState, onNext }: Props) {
  const [showChart, setShowChart] = useState(false);
  const [xAxis, setXAxis] = useState('name');
  const [yAxis, setYAxis] = useState('sales');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">销量横向对比</h2>
        <p className="text-slate-400 mt-2">配置图表参数，找出最受欢迎和最不受欢迎的套餐。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Control Panel */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Settings2 size={18} className="text-indigo-400" />
              <span>图表配置面板</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">选择 X 轴 (分类)</label>
              <select 
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="name">套餐类型</option>
                <option value="none" disabled>其他 (暂无)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">选择 Y 轴 (数值)</label>
              <select 
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="sales">销售份数 (份)</option>
                <option value="satisfaction">满意度评分 (0-100)</option>
                <option value="cost">单份成本 (元)</option>
              </select>
            </div>

            <div className="pt-4 mt-auto">
              <Button 
                className="w-full" 
                onClick={() => setShowChart(true)}
              >
                <BarChart3 className="mr-2 w-4 h-4" />
                生成可视化图表
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Area */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardContent className="p-6 flex-1 flex flex-col min-h-0">
            {!showChart ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                <p className="text-slate-500 text-sm">请在左侧配置参数并点击生成</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex-1 flex flex-col min-h-0 space-y-6"
              >
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mealSalesData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey={xAxis} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                      />
                      <Bar dataKey={yAxis} radius={[6, 6, 0, 0]} animationDuration={1500}>
                        {mealSalesData.map((entry, index) => {
                          let fill = '#475569';
                          if (yAxis === 'sales') {
                            fill = entry.sales === Math.max(...mealSalesData.map(d => d.sales)) ? '#818cf8' : entry.sales === Math.min(...mealSalesData.map(d => d.sales)) ? '#f43f5e' : '#475569';
                          } else if (yAxis === 'satisfaction') {
                            fill = entry.satisfaction >= 90 ? '#10b981' : entry.satisfaction < 60 ? '#f43f5e' : '#475569';
                          } else if (yAxis === 'cost') {
                            fill = entry.cost >= 13 ? '#f59e0b' : '#475569';
                          }
                          return <Cell key={`cell-${index}`} fill={fill} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-indigo-300 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                      分析与建议
                    </label>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('summon-ai', { detail: { message: '小绿，我观察了条形图，但我不知道该怎么写分析和建议，你能引导我一下吗？' } }))}
                      className="text-xs flex items-center text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1.5 rounded-md"
                    >
                      <Sparkles size={14} className="mr-1" />
                      让小绿引导我
                    </button>
                  </div>
                  <textarea
                    value={appState.step2Analysis}
                    onChange={(e) => updateAppState({ step2Analysis: e.target.value })}
                    placeholder="请根据图表写下你的分析与建议（哪个受欢迎，哪个该下架？）"
                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-600"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={onNext} disabled={!appState.step2Analysis.trim()} className="group">
                    保存并进入下一步
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
