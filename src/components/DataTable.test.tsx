import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from './DataTable';
import useData from '../hooks/useData';

jest.mock('../hooks/useData');

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('DataTable Component', () => {
  beforeEach(() => {
    (useData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      updateItem: jest.fn(),
    });
  });

  it('renders the table with data', () => {
    render(<DataTable />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    (useData as jest.Mock).mockReturnValue({
      data: [],
      loading: true,
      error: null,
      updateItem: jest.fn(),
    });

    render(<DataTable />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message', () => {
    (useData as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: 'Failed to fetch data',
      updateItem: jest.fn(),
    });

    render(<DataTable />);
    
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  it('allows editing of a row', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    (useData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      updateItem: mockUpdateItem,
    });

    render(<DataTable />);
    
    // Click edit button
    fireEvent.click(screen.getAllByText('Modifier')[0]);

    // Change name
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'John Updated' } });

    // Save changes
    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(mockUpdateItem).toHaveBeenCalledWith(1, { name: 'John Updated', email: 'john@example.com' });
    });
  });
});
