import axios from "axios";

const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const GOLD_URL = "https://www.altinkaynak.com/Altin/Kur/Guncel";

export interface GoldPrice {
  type: string;
  buying: string;
  selling: string;
}

export const fetchGoldPrices = async (): Promise<GoldPrice[]> => {
  try {
    const response = await axios.get(
      `${CORS_PROXY}${encodeURIComponent(GOLD_URL)}`
    );
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "text/html");

    const prices: GoldPrice[] = [];
    const rows = doc.querySelectorAll("table tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 3) {
        prices.push({
          type: cells[0].textContent?.trim() || "",
          buying: cells[2].textContent?.trim() || "",
          selling: cells[3].textContent?.trim() || "",
        });
      }
    });

    return prices;
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    return [];
  }
};
