import { useState, useEffect } from 'react';
import axios from 'axios';

type DataItem = {
  id: number;
  name: string;
  email: string;
};

const useData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des données.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateItem = async (id: number, updates: Partial<DataItem>) => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updates);
      setData(prevData =>
        prevData.map(item => (item.id === id ? response.data : item))
      );
      return true;
    } catch (error) {
      setError('Une erreur est survenue lors de la mise à jour de l\'élément.');
      return false;
    }
  };

  return { data, loading, error, updateItem };
};

export default useData;
