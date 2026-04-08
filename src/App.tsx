import { useState } from 'react';
import { Database, BarChart3, TrendingUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Step1DataFetch from './steps/Step1DataFetch';
import Step2BarChart from './steps/Step2BarChart';
import Step3LineChart from './steps/Step3LineChart';
import Step4Report from './steps/Step4Report';
import AICompanion from './components/AICompanion';

export type AppState = {
  dataUnlocked: boolean;
  step2Analysis: string;
  step3Analysis: string;
};

const steps = [
  { id: 1, title: '数据检索', icon: Database },
  { id: 2, title: '销量对比', icon: BarChart3 },
  { id: 3, title: '厨余趋势', icon: TrendingUp },
  { id: 4, title: '分析报告', icon: FileText },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [appState, setAppState] = useState<AppState>({
    dataUnlocked: false,
    step2Analysis: '',
    step3Analysis: '',
  });

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              绿叶配餐数据终端
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">v2.0.4 // Analyst Edition</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isDisabled = step.id > 1 && !appState.dataUnlocked;

              return (
                <button
                  key={step.id}
                  onClick={() => !isDisabled && setCurrentStep(step.id)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left",
                    isActive ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "hover:bg-slate-800/50 text-slate-400",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    isCompleted && !isActive && "text-slate-300"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "bg-indigo-500/20" : "bg-slate-800"
                  )}>
                    <Icon size={18} />
                  </div>
                  <span className="font-medium">Step {step.id}: {step.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                学
              </div>
              <div>
                <p className="text-sm font-medium">见习分析师</p>
                <p className="text-xs text-slate-400">四年级数据科学组</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          <div className="max-w-6xl mx-auto p-8 min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {currentStep === 1 && <Step1DataFetch appState={appState} updateAppState={updateAppState} onNext={handleNextStep} />}
                {currentStep === 2 && <Step2BarChart appState={appState} updateAppState={updateAppState} onNext={handleNextStep} />}
                {currentStep === 3 && <Step3LineChart appState={appState} updateAppState={updateAppState} onNext={handleNextStep} />}
                {currentStep === 4 && <Step4Report appState={appState} updateAppState={updateAppState} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* AI Companion */}
      <AICompanion currentStep={currentStep} appState={appState} />
    </div>
  );
}
