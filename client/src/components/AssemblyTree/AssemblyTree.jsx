import { useState, useEffect } from "react";
import { Paper, TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

function AssemblyTree() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAssemblyId, setSelectedAssemblyId] = useState(null);
  const [assembly, setAssembly] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/assy/search?term=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Ошибка при поиске сборок");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssemblyId) {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:8080/api/assy/${selectedAssemblyId}/tree`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при загрузке данных");
          }
          return response.json();
        })
        .then((data) => {
          setAssembly(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [selectedAssemblyId]);

  const renderTree = (node, level = 0) => {
    const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8"];
    const color = colors[level % colors.length];

    return (
      <List key={node.id} style={{ marginLeft: `${level * 30}px` }}>
        <ListItem style={{ borderLeft: `2px solid ${color}` }}>
          <ListItemText
            primary={<strong>{node.designation}</strong>}
            secondary={node.name}
            style={{ color }}
          />
          {node.children && node.children.length > 0 && (
            <List>
              {node.children.map((child) => renderTree(child, level + 1))}
            </List>
          )}
          {node.parts && node.parts.length > 0 && (
            <List>
              {node.parts.map((part) => (
                <ListItem key={part.id} style={{ borderLeft: `2px solid ${color}` }}>
                  <ListItemText
                    primary={<strong>{part.designation}</strong>}
                    secondary={`${part.name} (Материал: ${part.material})`}
                    style={{ color }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </ListItem>
      </List>
    );
  };

  return (
    <Paper style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Дерево сборки
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Введите обозначение или название сборки"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Поиск
        </Button>
      </div>

      {loading && <Typography>Загрузка...</Typography>}
      {error && <Typography color="error">Ошибка: {error}</Typography>}
      {searchResults.length > 0 && (
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Результаты поиска:</Typography>
          <List>
            {searchResults.map((assy) => (
              <ListItem key={assy.id} button onClick={() => setSelectedAssemblyId(assy.id)}>
                <ListItemText primary={`${assy.designation} - ${assy.name}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {selectedAssemblyId && assembly && (
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h6">Дерево сборки: {assembly.designation}</Typography>
          {renderTree(assembly)}
        </Paper>
      )}
    </Paper>
  );
}

export default AssemblyTree;