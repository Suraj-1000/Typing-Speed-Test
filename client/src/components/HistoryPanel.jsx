import React, { useEffect } from 'react';
import { useScoreStore } from '../store/useScoreStore';
import { History, Calendar, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * HistoryPanel Component
 * Displays the list of the user's recent typing speed scores and statistics.
 */
const HistoryPanel = () => {
  const { history, getHistory, isLoading, error } = useScoreStore();

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full p-6 rounded-2xl glass-panel border border-white/5 shadow-xl flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Performance</h3>
            <p className="text-xs text-muted-foreground">Your last 10 typing speed tests</p>
          </div>
        </div>
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
        <div className="overflow-x-auto w-full rounded-xl border border-white/5">
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
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPanel;
