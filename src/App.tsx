/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, FileBarChart, Settings, Activity, Heart, Users, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from './components/StatCard';
import { SentimentCharts } from './components/SentimentCharts';
import { FeedbackList } from './components/FeedbackList';
import { InputArea } from './components/InputArea';
import { FeedbackItem, SentimentStats } from './types';
import { analyzeSentiment } from './services/geminiService';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Reports', icon: FileBarChart, active: false },
  { label: 'Analytics', icon: Activity, active: false },
  { label: 'Feedback', icon: MessageSquare, active: false },
  { label: 'Customers', icon: Users, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

export default function App() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sentiment_data');
    if (saved) {
      try {
        setFeedbackItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
      // Initial sample data
      setFeedbackItems([
        { id: '1', text: "The new interface is incredibly intuitive and fast!", sentiment: 'positive', timestamp: Date.now() - 3600000 },
        { id: '2', text: "I'm having trouble finding the export button in the reports section.", sentiment: 'neutral', timestamp: Date.now() - 7200000 },
        { id: '3', text: "The app crashed three times today while uploading files.", sentiment: 'negative', timestamp: Date.now() - 10800000 },
      ]);
    }
  }, []);

  // Save to localStorage whenever feedbackItems change
  useEffect(() => {
    localStorage.setItem('sentiment_data', JSON.stringify(feedbackItems));
  }, [feedbackItems]);

  const stats = useMemo<SentimentStats>(() => {
    const counts = feedbackItems.reduce(
      (acc, item) => {
        acc[item.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );
    return {
      total: feedbackItems.length,
      ...counts,
    };
  }, [feedbackItems]);

  const handleAnalyze = async (text: string) => {
    const sentiment = await analyzeSentiment(text);
    const newItem: FeedbackItem = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      sentiment,
      timestamp: Date.now(),
    };
    setFeedbackItems(prev => [newItem, ...prev]);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setFeedbackItems([]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SentimentPro</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center gap-3 p-3 bg-indigo-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-indigo-900 font-bold">
              KP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Kelebogile P.</p>
              <p className="text-xs text-indigo-300 truncate">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Sentiment Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
              System Online
            </div>
            <span className="text-sm text-slate-400 font-medium">May 2026</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Feedback" 
              value={stats.total} 
              icon={<MessageSquare className="w-6 h-6 text-indigo-600" />} 
              colorClass="border-indigo-500"
            />
            <StatCard 
              title="Positive" 
              value={stats.positive} 
              icon={<SmileIcon />} 
              colorClass="border-emerald-500"
            />
            <StatCard 
              title="Neutral" 
              value={stats.neutral} 
              icon={<MehIcon />} 
              colorClass="border-slate-400"
            />
            <StatCard 
              title="Negative" 
              value={stats.negative} 
              icon={<FrownIcon />} 
              colorClass="border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Input & Charts */}
            <div className="xl:col-span-2 space-y-8">
              <InputArea onAnalyze={handleAnalyze} onClear={handleClear} />
              <SentimentCharts stats={stats} />
            </div>

            {/* Feed */}
            <div className="h-full min-h-[500px] xl:min-h-0">
              <FeedbackList items={feedbackItems} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Icon Helpers
function SmileIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function MehIcon() {
  return (
    <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function FrownIcon() {
  return (
    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

