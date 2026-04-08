import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Database, Server, Users, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AppState } from '@/src/App';
import { mealSalesData, wasteData } from '@/src/data/mockData';

interface Props {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  onNext: () => void;
}

export default function Step1DataFetch({ appState, updateAppState, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFetchError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  const handleFetchSuccess = () => {
    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      setLoading(false);
      updateAppState({ dataUnlocked: true });
    }, 1500);
  };

  return (
    <div className="flex flex-col space-y-8 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">获取系统数据</h2>
        <p className="text-slate-400 mt-2">请选择合适的数据源进行分析。注意：作为数据分析师，我们需要客观、全面的数据。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-slate-700 transition-colors cursor-pointer group" onClick={() => handleFetchError("警告：家长群反馈属于主观数据，且样本量不足，存在偏差。")}>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
              <Users className="text-slate-400" size={20} />
            </div>
            <CardTitle className="text-lg">家长群主观反馈记录</CardTitle>
            <CardDescription>来源：微信群聊天记录</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">包含部分家长对餐食口味的主观评价和建议。</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors cursor-pointer group" onClick={() => handleFetchError("警告：单一班级的数据无法代表全校情况，存在局部偏差。")}>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
              <Database className="text-slate-400" size={20} />
            </div>
            <CardTitle className="text-lg">四(1)班单日手工统计</CardTitle>
            <CardDescription>来源：班级卫生委员</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">仅包含一个班级某一天的剩菜剩饭预估量。</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500/60 transition-colors cursor-pointer group relative overflow-hidden" onClick={handleFetchSuccess}>
          <div className="absolute top-0 right-0 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
            官方推荐
          </div>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center mb-4 group-hover:bg-indigo-800/50 transition-colors">
              <Server className="text-indigo-400" size={20} />
            </div>
            <CardTitle className="text-lg text-indigo-100">绿叶配餐全校 ERP 报表</CardTitle>
            <CardDescription className="text-indigo-300/70">来源：中央厨房系统</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-200/70">包含全校所有班级近一个月的精确销量与厨余称重数据。</p>
          </CardContent>
        </Card>
      </div>

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{errorMsg}</p>
        </motion.div>
      )}

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-slate-400 font-mono text-sm animate-pulse">正在连接 ERP 系统拉取数据...</p>
        </div>
      )}

      {appState.dataUnlocked && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 size={20} />
              <span className="font-medium">数据拉取成功</span>
            </div>
            <Button onClick={onNext} className="group">
              进入数据分析
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">表1: 上月套餐销量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800/50 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">套餐类型</th>
                        <th className="px-4 py-3 font-medium text-right">销售份数</th>
                        <th className="px-4 py-3 font-medium text-right">满意度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {mealSalesData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-300">{row.name}</td>
                          <td className="px-4 py-3 text-right font-mono text-indigo-300">{row.sales}</td>
                          <td className="px-4 py-3 text-right font-mono text-emerald-400">{row.satisfaction}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">表2: 近20天上学日厨余垃圾重量 (预览)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800/50 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">日期</th>
                        <th className="px-4 py-3 font-medium text-right">实际重量 (kg)</th>
                        <th className="px-4 py-3 font-medium text-right">控制目标 (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {wasteData.slice(0, 4).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-300">{row.day}</td>
                          <td className="px-4 py-3 text-right font-mono text-indigo-300">{row.weight}</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400">{row.target}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-center text-slate-500 italic">... 还有 16 条数据记录</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
