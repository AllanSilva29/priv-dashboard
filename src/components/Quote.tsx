import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { useStore } from '../store';

export function Quote() {
  const quotes = useStore(state => state.quotes);
  const quoteColor = useStore(state => state.quoteColor);
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [quotes]);

  return (
    <div className="text-center max-w-2xl mx-auto" style={{ color: quoteColor }}>
      <QuoteIcon className="w-8 h-8 mb-4 opacity-60 mx-auto" />
      <p className="text-xl font-light leading-relaxed italic mb-4">"{quote.text}"</p>
      <p className="text-sm opacity-80">— {quote.author}</p>
    </div>
  );
}