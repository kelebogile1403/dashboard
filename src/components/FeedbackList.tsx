/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Smile, Meh, Frown } from 'lucide-react';
import { FeedbackItem, Sentiment } from '../types';

interface FeedbackListProps {
  items: FeedbackItem[];
}

const sentimentConfig: Record<Sentiment, { color: string; icon: any; label: string }> = {
  positive: { color: 'bg-emerald-100 text-emerald-700', icon: Smile, label: 'Positive' },
  neutral: { color: 'bg-slate-100 text-slate-700', icon: Meh, label: 'Neutral' },
  negative: { color: 'bg-red-100 text-red-700', icon: Frown, label: 'Negative' },
};

export function FeedbackList({ items }: FeedbackListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800">Recent Feedback</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              No feedback analyzed yet.
            </div>
          ) : (
            items.map((item) => {
              const config = sentimentConfig[item.sentiment];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 border border-gray-100 rounded-xl flex items-start gap-4 group hover:border-indigo-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-sm leading-relaxed break-words">{item.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
