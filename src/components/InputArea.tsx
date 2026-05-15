/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InputAreaProps {
  onAnalyze: (text: string) => Promise<void>;
  onClear: () => void;
}

export function InputArea({ onAnalyze, onClear }: InputAreaProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      await onAnalyze(text);
      setText('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a customer comment here... (e.g., 'The service was absolutely fantastic, but the delivery was a bit slow.')"
        className="w-full h-32 p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
      />
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>{isAnalyzing ? 'Analyzing with AI...' : 'Analyze Sentiment'}</span>
        </button>
        
        <button
          onClick={onClear}
          title="Clear all data"
          className="p-3 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
