interface Country {
  code: string;
  name: string;
}

export const getCountries = (): Country[] => {
  return [
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    // Add more countries as needed
  ];
};

export const getCountryByCode = (code: string): Country | undefined => {
  return getCountries().find(c => c.code === code);
};
