/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface FeedbackItem {
  id: string;
  text: string;
  sentiment: Sentiment;
  timestamp: number;
}

export interface SentimentStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}
