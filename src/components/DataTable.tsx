import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress } from '@mui/material';
import useData from '../hooks/useData';

const DataTable: React.FC = () => {
  const { data, loading, error, updateItem } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  const handleEdit = (id: number, name: string, email: string) => {
    setEditingId(id);
    setEditedName(name);
    setEditedEmail(email);
  };

  const handleSave = async (id: number) => {
    const success = await updateItem(id, { name: editedName, email: editedEmail });
    if (success) {
      setEditingId(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <TextField value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                ) : (
                  item.name
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <TextField value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                ) : (
                  item.email
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Button onClick={() => handleSave(item.id)}>Enregistrer</Button>
                ) : (
                  <Button onClick={() => handleEdit(item.id, item.name, item.email)}>Modifier</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;