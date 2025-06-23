import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Container } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BomTable from "./components/BomTable/BomTable";
import PartTable from "./components/PartTable/PartTable";
import AssemblyTree from "./components/AssemblyTree/AssemblyTree";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTable, setActiveTable] = useState("all");
  const [selectedAssemblyId, setSelectedAssemblyId] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTableChange = (table) => {
    setActiveTable(table);
    if (table === "tree") {
      setSelectedAssemblyId(1); // Пример: выбранная сборка с ID = 1
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Управление сборками и деталями
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <List>
          <ListItem button onClick={() => handleTableChange("bom")}>
            <ListItemText primary="Сборочные единицы" />
          </ListItem>
          <ListItem button onClick={() => handleTableChange("part")}>
            <ListItemText primary="Детали" />
          </ListItem>
          <ListItem button onClick={() => handleTableChange("all")}>
            <ListItemText primary="Все таблицы" />
          </ListItem>
          <ListItem button onClick={() => handleTableChange("tree")}>
            <ListItemText primary="Дерево сборки" />
          </ListItem>
        </List>
      </Drawer>
      <Container>
        <main>
          {activeTable === "bom" && <BomTable />}
          {activeTable === "part" && <PartTable />}
          {activeTable === "all" && (
            <>
              <br />
              <BomTable />
              <br />
              <PartTable />
            </>
          )}
          {activeTable === "tree" && (
            <AssemblyTree assemblyId={selectedAssemblyId} />
          )}
        </main>
      </Container>
    </>
  );
}

export default App;