interface currencyItem {
  name: string;
  code: string;
}

export const currencies: currencyItem[] = [
  {
    name: "United States Dollars",
    code: "USD"
  },
  {
    name: "Indonesian Rupiahs",
    code: "IDR"
  }
];

export const currencyRates = {
  ZBC: 1, // ZBC is always 1
  USD: 3,
  IDR: 42135
};
