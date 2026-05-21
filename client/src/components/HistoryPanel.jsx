import React, { useEffect, useState } from 'react';
import { useScoreStore } from '../store/useScoreStore';
import { History, Calendar, Award, BarChart3, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/**
 * HistoryPanel Component
 * Displays the list of the user's recent typing speed scores and statistics,
 * along with interactive analytics charting using Recharts.
 */
const HistoryPanel = () => {
  const { history, getHistory, isLoading, error } = useScoreStore();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'analytics'

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Recharts Chronological Data
  const chartData = [...history].reverse().map((item, index) => ({
    name: `Test ${index + 1}`,
    WPM: item.netWpm,
    Accuracy: item.accuracy,
    Errors: item.errors,
    date: new Date(item.createdAt).toLocaleDateString()
  }));

  // Calculations
  const averageWpm = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.netWpm, 0) / history.length) 
    : 0;
  const averageAccuracy = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / history.length) 
    : 0;
  const bestWpm = history.length > 0 
    ? Math.max(...history.map(h => h.netWpm)) 
    : 0;
  const totalTests = history.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full p-6 rounded-2xl glass-panel border border-white/5 shadow-xl flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Performance</h3>
            <p className="text-xs text-muted-foreground">Your last 10 typing speed tests</p>
          </div>
        </div>

        {/* Tab Buttons */}
        {!isLoading && !error && history.length > 0 && (
          <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'list' 
                  ? 'bg-primary text-primary-foreground shadow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              History List
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analytics' 
                  ? 'bg-primary text-primary-foreground shadow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics Charts
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 font-mono text-xs text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Fetching past records...
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-400 font-mono text-xs">
          Error: {error}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-white/10 rounded-xl">
          <Award className="w-8 h-8 mx-auto mb-2 text-primary opacity-60" />
          No tests completed yet. Finish a typing speed test to save and view your results here!
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto w-full rounded-xl border border-white/5"
            >
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white/5 text-muted-foreground font-mono text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="p-4">Completed On</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Net WPM</th>
                    <th className="p-4">Accuracy</th>
                    <th className="p-4">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr 
                      key={item.id || index}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 flex items-center gap-2 font-medium text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="p-4 font-mono font-medium text-muted-foreground">
                        {item.duration}s
                      </td>
                      <td className="p-4 font-bold text-primary font-mono text-base">
                        {item.netWpm}
                      </td>
                      <td className="p-4 font-semibold text-emerald-400 font-mono">
                        {item.accuracy}%
                      </td>
                      <td className="p-4 font-medium text-red-400 font-mono">
                        {item.errors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col transition-all duration-300 hover:border-primary/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Average WPM</p>
                  <span className="text-2xl font-black text-primary font-mono">{averageWpm}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col transition-all duration-300 hover:border-yellow-500/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Best WPM</p>
                  <span className="text-2xl font-black text-yellow-400 font-mono">{bestWpm}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col transition-all duration-300 hover:border-emerald-500/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Avg Accuracy</p>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{averageAccuracy}%</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col transition-all duration-300 hover:border-white/10">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-1">Tests Completed</p>
                  <span className="text-2xl font-black text-foreground font-mono">{totalTests}</span>
                </div>
              </div>

              {/* Chart Plot */}
              <div className="w-full h-[300px] p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255, 255, 255, 0.3)" 
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255, 255, 255, 0.3)" 
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: 'rgba(255, 255, 255, 0.08)', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        paddingTop: '10px'
                      }}
                    />
                    <Line 
                      name="Speed (WPM)"
                      type="monotone" 
                      dataKey="WPM" 
                      stroke="var(--color-primary)" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      dot={{ strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      name="Accuracy (%)"
                      type="monotone" 
                      dataKey="Accuracy" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 1, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default HistoryPanel;
