import axios from "axios";

// API URLs - always use our backend API endpoints
// Development: Vite proxy -> Altinkaynak API
// Production: Vercel serverless functions -> Altinkaynak API
const GOLD_API_URL = "/api/gold";
const CURRENCY_API_URL = "/api/currency";

// Base API response interface
export interface ApiResponse {
  Id: number | string;
  Alis: string;
  Satis: string;
  Kod: string;
  Aciklama: string;
  MobilAciklama: string;
  GuncellenmeZamani: string;
  Main: boolean;
  DataGroup: number | null;
  WebGroup: number | null;
  WidgetAciklama: string;
  Change: number | null;
}

// Display-friendly interface for components
export interface PriceDisplay {
  type: string;
  buying: string;
  selling: string;
  code: string;
  lastUpdate: string;
  change: number | null;
}

// Sadece gösterilecek altın türleri (sırayla)
// Önce 24 ayar gram, sonra çeyrek/yarım/teklik, sonra 22 ayarlar, en son Ata/Reşat
const ALLOWED_GOLD_CODES = ["GA", "C", "Y", "T", "GAT22", "B", "A", "R"];

// Sadece gösterilecek döviz türleri (sırayla)
// Önce ana dövizler, sonra diğerleri
const ALLOWED_CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "JPY",
  "SAR",
  "AUD",
  "CAD",
  "RUB",
  "AZN",
  "CNY",
  "RON",
  "AED",
  "KWD",
];

export const fetchGoldPrices = async (): Promise<PriceDisplay[]> => {
  try {
    const response = await axios.get<ApiResponse[]>(GOLD_API_URL);

    // Sadece izin verilen kodları filtrele ve display formatına çevir
    const displayPrices: PriceDisplay[] = response.data
      .filter((item) => ALLOWED_GOLD_CODES.includes(item.Kod))
      .map((item) => ({
        type: item.MobilAciklama,
        buying: item.Alis,
        selling: item.Satis,
        code: item.Kod,
        lastUpdate: item.GuncellenmeZamani,
        change: item.Change,
      }));

    // ALLOWED_GOLD_CODES sırasına göre sırala
    return displayPrices.sort((a, b) => {
      const indexA = ALLOWED_GOLD_CODES.indexOf(a.code);
      const indexB = ALLOWED_GOLD_CODES.indexOf(b.code);
      return indexA - indexB;
    });
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    return [];
  }
};

export const fetchCurrencyPrices = async (): Promise<PriceDisplay[]> => {
  try {
    const response = await axios.get<ApiResponse[]>(CURRENCY_API_URL);

    // Sadece izin verilen kodları filtrele ve display formatına çevir
    const displayPrices: PriceDisplay[] = response.data
      .filter((item) => ALLOWED_CURRENCY_CODES.includes(item.Kod))
      .map((item) => ({
        type: `${item.Kod} - ${item.MobilAciklama}`, // "USD - Amerikan Doları" formatında
        buying: item.Alis,
        selling: item.Satis,
        code: item.Kod,
        lastUpdate: item.GuncellenmeZamani,
        change: item.Change,
      }));

    // ALLOWED_CURRENCY_CODES sırasına göre sırala
    return displayPrices.sort((a, b) => {
      const indexA = ALLOWED_CURRENCY_CODES.indexOf(a.code);
      const indexB = ALLOWED_CURRENCY_CODES.indexOf(b.code);
      return indexA - indexB;
    });
  } catch (error) {
    console.error("Error fetching currency prices:", error);
    return [];
  }
};
