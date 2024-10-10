import { useEffect, useState } from "react"

export default function useFetch(url: string) {
  const [data, setData] = useState(); // State for data
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<Error | null>(null); // State for error handling
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`)
        }
        const data = await response.json();
        setData(data);
      } catch (error: unknown) {
        setError(error as Error & null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  },[url])

  return { data, loading, error }
}