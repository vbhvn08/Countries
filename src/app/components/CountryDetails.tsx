import React from 'react';
import useFetch from '@/app/hooks/useFetch';
import { Country, Currency } from '@/app/types';

interface CountryDetailsProps {
  countryCode: string;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ countryCode }) => {
  

  const { data, loading, error } = useFetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
  
  if (loading) return <p className='mx-auto max-w-md'>Loading...</p>
  if (error) return <p className='mx-auto'>Error: {error?.message}</p>
  
  const countryDetails: Country = data! && data[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-2 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{countryDetails.name?.common}</h2>
      <div className="flex justify-center mb-4">
        <img
          src={countryDetails.flags?.png}
          alt={`${countryDetails.name?.common} Flag`}
          className="w-32 h-20 object-cover rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">Population:</span> {countryDetails.population.toLocaleString()}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Languages:</span> {Object.values(countryDetails.languages || {}).join(', ')}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Currencies:</span> {Object.values(countryDetails.currencies || {}).map((c: Currency) => c.name).join(', ')}
        </p>
      </div>
    </div>
  );
};

export default CountryDetails;
