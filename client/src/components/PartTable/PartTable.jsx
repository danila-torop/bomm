import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, TextField, Container } from "@mui/material";

function PartTable() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    designation: "",
    name: "",
    material: "",
    assy_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editedRecord, setEditedRecord] = useState({
    designation: "",
    name: "",
    material: "",
    assy_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:8080/api/parts")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  };

  const handleRowSelect = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleDelete = () => {
    selectedRows.forEach((id) => {
      fetch(`http://localhost:8080/api/part/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Запись с ID ${id} удалена`);
          } else {
            console.error(`Ошибка при удалении записи с ID ${id}`);
          }
        })
        .catch((error) => console.error("Ошибка при удалении:", error));
    });

    fetchData();
    setSelectedRows(new Set());
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingId(id);
      setEditedRecord({
        designation: itemToEdit.designation,
        name: itemToEdit.name,
        material: itemToEdit.material,
        assy_id: itemToEdit.assy_id,
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord({
      ...editedRecord,
      [name]: value,
    });
  };

  const handleSaveEdit = (id) => {
    fetch(`http://localhost:8080/api/part/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedRecord),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Обновлено:", result);
        setEditingId(null);
        fetchData();
      })
      .catch((error) => console.error("Ошибка при сохранении изменений:", error));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/part", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Добавлено:", result);
        setIsAdding(false);
        setNewRecord({ designation: "", name: "", material: "", assy_id: "" });
        fetchData();
      })
      .catch((error) => console.error("Ошибка при добавлении:", error));
  };

  return (
    <Container>
      <div style={{ marginBottom: 20 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginRight: 10 }}>
          Добавить запись
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDelete} disabled={selectedRows.size === 0}>
          Удалить выбранные
        </Button>
      </div>

      {isAdding && (
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Обозначение"
              name="designation"
              value={newRecord.designation}
              onChange={handleNewRecordChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Наименование"
              name="name"
              value={newRecord.name}
              onChange={handleNewRecordChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Материал"
              name="material"
              value={newRecord.material}
              onChange={handleNewRecordChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="ID СБ"
              name="assy_id"
              value={newRecord.assy_id}
              onChange={handleNewRecordChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: 10 }}>
              Сохранить
            </Button>
            <Button type="button" variant="contained" onClick={() => setIsAdding(false)}>
              Отмена
            </Button>
          </form>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(data.map((item) => item.id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableCell>
              <TableCell>Обозначение</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Материал</TableCell>
              <TableCell>ID СБ</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                  />
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <TextField
                      name="designation"
                      value={editedRecord.designation}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    item.designation
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <TextField
                      name="name"
                      value={editedRecord.name}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <TextField
                      name="material"
                      value={editedRecord.material}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    item.material
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <TextField
                      name="assy_id"
                      value={editedRecord.assy_id}
                      onChange={handleEditChange}
                      fullWidth
                    />
                  ) : (
                    item.assy_id
                  )}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <>
                      <Button variant="contained" color="primary" onClick={() => handleSaveEdit(item.id)}>
                        Сохранить
                      </Button>
                      <Button variant="contained" color="secondary" onClick={handleCancelEdit}>
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(item.id)}>
                      Редактировать
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PartTable;