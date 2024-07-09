import { useState, useEffect } from 'react';
import axios from 'axios';

interface DataItem {
  id: number;
  name: string;
  email: string;
}

const useData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DataItem[]>('https://jsonplaceholder.typicode.com/users');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Une erreur est survenue lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: number, updatedItem: Partial<DataItem>) => {
    try {
      const response = await axios.put<DataItem>(`https://jsonplaceholder.typicode.com/users/${id}`, updatedItem);
      setData(data.map(item => item.id === id ? { ...item, ...response.data } : item));
      return true;
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour de l\'élément.');
      return false;
    }
  };

  return { data, loading, error, updateItem };
};

export default useData;