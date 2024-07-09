import { renderHook, act } from '@testing-library/react-hooks';
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
    const { result, waitForNextUpdate } = renderHook(() => useData());

    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result, waitForNextUpdate } = renderHook(() => useData());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe('Une erreur est survenue lors de la récupération des données.');
  });

  it('updates an item', async () => {
    (axios.put as jest.Mock).mockResolvedValue({ data: { ...mockData[0], name: 'Updated John' } });

    const { result, waitForNextUpdate } = renderHook(() => useData());
    
    await waitForNextUpdate();

    act(() => {
      result.current.updateItem(1, { name: 'Updated John' });
    });

    await waitForNextUpdate();

    expect(result.current.data[0].name).toBe('Updated John');
  });

  it('handles update error', async () => {
    (axios.put as jest.Mock).mockRejectedValue(new Error('Update Error'));

    const { result, waitForNextUpdate } = renderHook(() => useData());
    
    await waitForNextUpdate();

    let updateSuccess;
    act(() => {
      updateSuccess = result.current.updateItem(1, { name: 'Updated John' });
    });

    await waitForNextUpdate();

    expect(await updateSuccess).toBe(false);
    expect(result.current.error).toBe('Une erreur est survenue lors de la mise à jour de l\'élément.');
  });
});