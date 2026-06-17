export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',    name: 'US Dollar',           flag: '🇺🇸' },
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee',        flag: '🇮🇳' },
  { code: 'EUR', symbol: '€',   name: 'Euro',                flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',   name: 'British Pound',       flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar',   flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',     flag: '🇨🇦' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',        flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥',   name: 'Chinese Yuan',        flag: '🇨🇳' },
  { code: 'BRL', symbol: 'R$',  name: 'Brazilian Real',      flag: '🇧🇷' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso',        flag: '🇲🇽' },
  { code: 'KRW', symbol: '₩',   name: 'South Korean Won',    flag: '🇰🇷' },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar',    flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar',    flag: '🇭🇰' },
  { code: 'CHF', symbol: 'Fr',  name: 'Swiss Franc',         flag: '🇨🇭' },
  { code: 'SEK', symbol: 'kr',  name: 'Swedish Krona',       flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr',  name: 'Norwegian Krone',     flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr',  name: 'Danish Krone',        flag: '🇩🇰' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar',  flag: '🇳🇿' },
  { code: 'ZAR', symbol: 'R',   name: 'South African Rand',  flag: '🇿🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',          flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼',   name: 'Saudi Riyal',         flag: '🇸🇦' },
  { code: 'QAR', symbol: '﷼',   name: 'Qatari Riyal',        flag: '🇶🇦' },
  { code: 'KWD', symbol: 'KD',  name: 'Kuwaiti Dinar',       flag: '🇰🇼' },
  { code: 'PKR', symbol: '₨',   name: 'Pakistani Rupee',     flag: '🇵🇰' },
  { code: 'BDT', symbol: '৳',   name: 'Bangladeshi Taka',    flag: '🇧🇩' },
  { code: 'LKR', symbol: '₨',   name: 'Sri Lankan Rupee',    flag: '🇱🇰' },
  { code: 'NPR', symbol: '₨',   name: 'Nepalese Rupee',      flag: '🇳🇵' },
  { code: 'THB', symbol: '฿',   name: 'Thai Baht',           flag: '🇹🇭' },
  { code: 'IDR', symbol: 'Rp',  name: 'Indonesian Rupiah',   flag: '🇮🇩' },
  { code: 'MYR', symbol: 'RM',  name: 'Malaysian Ringgit',   flag: '🇲🇾' },
  { code: 'PHP', symbol: '₱',   name: 'Philippine Peso',     flag: '🇵🇭' },
  { code: 'VND', symbol: '₫',   name: 'Vietnamese Dong',     flag: '🇻🇳' },
  { code: 'TRY', symbol: '₺',   name: 'Turkish Lira',        flag: '🇹🇷' },
  { code: 'RUB', symbol: '₽',   name: 'Russian Ruble',       flag: '🇷🇺' },
  { code: 'PLN', symbol: 'zł',  name: 'Polish Zloty',        flag: '🇵🇱' },
  { code: 'EGP', symbol: '£',   name: 'Egyptian Pound',      flag: '🇪🇬' },
  { code: 'NGN', symbol: '₦',   name: 'Nigerian Naira',      flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling',     flag: '🇰🇪' },
  { code: 'GHS', symbol: '₵',   name: 'Ghanaian Cedi',       flag: '🇬🇭' },
  { code: 'ARS', symbol: '$',   name: 'Argentine Peso',      flag: '🇦🇷' },
  { code: 'CLP', symbol: '$',   name: 'Chilean Peso',        flag: '🇨🇱' },
  { code: 'COP', symbol: '$',   name: 'Colombian Peso',      flag: '🇨🇴' },
  { code: 'PEN', symbol: 'S/',  name: 'Peruvian Sol',        flag: '🇵🇪' },
  { code: 'ILS', symbol: '₪',   name: 'Israeli Shekel',      flag: '🇮🇱' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar',       flag: '🇹🇼' },
];

// Fallback rates relative to USD
export const FALLBACK_RATES: Record<string, number> = {
  USD:1, INR:83.5, EUR:0.92, GBP:0.79, AUD:1.53, CAD:1.36, JPY:149.5,
  CNY:7.24, BRL:4.97, MXN:17.2, KRW:1325, SGD:1.34, HKD:7.82, CHF:0.90,
  SEK:10.42, NOK:10.58, DKK:6.88, NZD:1.63, ZAR:18.63, AED:3.67, SAR:3.75,
  QAR:3.64, KWD:0.308, PKR:278, BDT:110, LKR:320, NPR:133, THB:35.1,
  IDR:15650, MYR:4.72, PHP:56.5, VND:24500, TRY:32.5, RUB:92.5, PLN:3.98,
  EGP:30.9, NGN:1550, KES:129, GHS:15.8, ARS:875, CLP:945, COP:3950,
  PEN:3.73, ILS:3.68, TWD:31.5,
};

// Locale → currency mapping
const LOCALE_CURRENCY: Record<string, string> = {
  'en-IN':'INR','hi':'INR','hi-IN':'INR','bn-IN':'INR','te':'INR','mr':'INR','ta':'INR',
  'en-GB':'GBP','en-AU':'AUD','en-CA':'CAD','en-NZ':'NZD','en-SG':'SGD','en-ZA':'ZAR',
  'en-PK':'PKR','en-BD':'BDT','en-LK':'LKR','en-NP':'NPR','en-PH':'PHP','en-NG':'NGN',
  'en-KE':'KES','en-GH':'GHS','en-AE':'AED',
  'de':'EUR','fr':'EUR','es-ES':'EUR','it':'EUR','pt-PT':'EUR','nl':'EUR',
  'pt-BR':'BRL','es-MX':'MXN','es-CO':'COP','es-CL':'CLP','es-AR':'ARS','es-PE':'PEN',
  'ja':'JPY','zh-CN':'CNY','zh-TW':'TWD','ko':'KRW','th':'THB','vi':'VND',
  'id':'IDR','ms':'MYR','tr':'TRY','ru':'RUB','pl':'PLN','ar-AE':'AED',
  'ar-SA':'SAR','ar-QA':'QAR','ar-KW':'KWD','ar-EG':'EGP','he':'ILS',
  'fil':'PHP','ur':'PKR',
};

let _rates: Record<string, number> = { ...FALLBACK_RATES };
let _ratesFetched = false;

export async function fetchRates(): Promise<Record<string, number>> {
  if (_ratesFetched) return _rates;
  // Try localStorage cache (1 hour)
  try {
    const cached = localStorage.getItem('sp_rates');
    if (cached) {
      const { r, t } = JSON.parse(cached);
      if (Date.now() - t < 3600000) { _rates = r; _ratesFetched = true; return _rates; }
    }
  } catch {}
  // Fetch from free API
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data?.rates) {
      _rates = data.rates;
      _ratesFetched = true;
      try { localStorage.setItem('sp_rates', JSON.stringify({ r: _rates, t: Date.now() })); } catch {}
    }
  } catch { /* use fallback */ }
  return _rates;
}

export function getRates(): Record<string, number> { return _rates; }

export function convertPrice(usdAmount: number, toCurrency: string): number {
  const rate = _rates[toCurrency] ?? FALLBACK_RATES[toCurrency] ?? 1;
  return usdAmount * rate;
}

export function formatPrice(usdAmount: number, currencyCode: string): string {
  const converted = convertPrice(usdAmount, currencyCode);
  const noDecimals = ['JPY','KRW','IDR','VND','CLP','COP','HUF','ISK'];
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: noDecimals.includes(currencyCode) ? 0 : 2,
      maximumFractionDigits: noDecimals.includes(currencyCode) ? 0 : 2,
    }).format(converted);
  } catch {
    const c = CURRENCIES.find(x => x.code === currencyCode);
    return `${c?.symbol ?? '$'}${converted.toFixed(2)}`;
  }
}

export function detectCurrency(): string {
  if (typeof window === 'undefined') return 'USD';
  const saved = localStorage.getItem('sp_currency');
  if (saved && CURRENCIES.find(c => c.code === saved)) return saved;
  const locale = navigator.language || 'en-US';
  return LOCALE_CURRENCY[locale] ?? LOCALE_CURRENCY[locale.split('-')[0]] ?? 'USD';
}

export function saveCurrency(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sp_currency', code);
  window.dispatchEvent(new CustomEvent('currency-changed', { detail: code }));
}
