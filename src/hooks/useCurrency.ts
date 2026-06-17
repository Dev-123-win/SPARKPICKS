'use client';
import { useState, useEffect, useCallback } from 'react';
import { detectCurrency, fetchRates, formatPrice as _fmt } from '@/lib/currency';

export function useCurrency() {
  const [currency, setCurrency] = useState('USD');
  const [ready, setReady]       = useState(false);

  const init = useCallback(async () => {
    const detected = detectCurrency();
    setCurrency(detected);
    await fetchRates();
    setReady(true);
  }, []);

  useEffect(() => {
    init();
    const handler = (e: Event) => {
      setCurrency((e as CustomEvent<string>).detail);
    };
    window.addEventListener('currency-changed', handler);
    return () => window.removeEventListener('currency-changed', handler);
  }, [init]);

  const fmt = useCallback(
    (usdAmount: number) => (ready ? _fmt(usdAmount, currency) : `$${usdAmount.toFixed(2)}`),
    [currency, ready]
  );

  return { currency, fmt, ready };
}
