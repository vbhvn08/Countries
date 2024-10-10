export interface Country {
  name: {
    common: string;
  };
  population: number;
  flags: {
    png: string;
  };
  languages: {
    [key: string]: string;
  };
  currencies: {
    [key: string]: Currency;
  };
  cca3: string; // country code
}

export interface Currency {
  name: string;
  symbol?: string;
}