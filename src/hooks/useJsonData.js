import { useState, useEffect } from 'react';

/**
 * Custom hook for loading JSON data (if needed for dynamic loading)
 * Currently, we're using direct imports, but this hook can be used
 * if you need to fetch JSON files dynamically or handle loading states
 * 
 * @param {string} path - Path to JSON file
 * @returns {Object} { data, loading, error }
 */
export function useJsonData(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load data from ${path}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [path]);

  return { data, loading, error };
}

