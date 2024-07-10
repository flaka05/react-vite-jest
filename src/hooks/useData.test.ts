import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import useData from './useData';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('useData Hook', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
  });

  it('fetches data on mount', async () => {
    const { result } = renderHook(() => useData());

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.data).toEqual(mockData));
    await waitFor(() => expect(result.current.error).toBeNull());
  });

  it('handles fetch error', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.data).toEqual([]));
    await waitFor(() => expect(result.current.error).toBe('Une erreur est survenue lors de la récupération des données.'));
  });

  it('updates an item', async () => {
    (axios.put as jest.Mock).mockResolvedValue({ data: { ...mockData[0], name: 'Updated John' } });

    const { result } = renderHook(() => useData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateItem(1, { name: 'Updated John' });
    });

  

    await waitFor(() => {
      expect(result.current.data[0].name).toBe('Updated John');
    });
  });

  it('handles update error', async () => {
    (axios.put as jest.Mock).mockRejectedValue(new Error('Update Error'));

    const { result } = renderHook(() => useData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let updateSuccess: boolean | undefined;

    await act(async () => {
      updateSuccess = await result.current.updateItem(1, { name: 'Updated John' });
    });

    await waitFor(() => expect(updateSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBe('Une erreur est survenue lors de la mise à jour de l\'élément.'));
  });
});
