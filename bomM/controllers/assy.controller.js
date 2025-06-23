const db = require('../db');

class AssyController {
  async createAssy(req, res) {
    const { designation, name } = req.body;
    const newAssy = await db.query(
      `INSERT INTO assy (designation, name) VALUES ($1, $2) RETURNING *`,
      [designation, name]
    );
    res.json(newAssy.rows[0]);
  }

  async getAssy(req, res) {
    const assys = await db.query(`SELECT * FROM assy`);
    res.json(assys.rows);
  }

  async getOneAssy(req, res) {
    const id = parseInt(req.params.id, 10); // Преобразуем id в число
  
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID должен быть числом" });
    }
  
    try {
      const assy = await db.query(`SELECT * FROM assy WHERE id = $1`, [id]);
      if (assy.rows.length === 0) {
        return res.status(404).json({ error: "Сборка не найдена" });
      }
      res.json(assy.rows[0]);
    } catch (error) {
      console.error("Ошибка при получении сборки:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  async updateAssy(req, res) {
    const { designation, name } = req.body;
    const id = req.params.id;
    const assy = await db.query(
      `UPDATE assy SET designation = $1, name = $2 WHERE id = $3 RETURNING *`,
      [designation, name, id]
    );
    res.json(assy.rows[0]);
  }

  async deleteAssy(req, res) {
    const id = req.params.id;
    const assy = await db.query(`DELETE FROM assy WHERE id = $1 RETURNING *`, [id]);
    res.json(assy.rows[0]);
  }

  async getAssemblyTree(req, res) {
    const id = req.params.id;

    try {
      // Получаем данные о сборке
      const assembly = await db.query(`SELECT * FROM assy WHERE id = $1`, [id]);
      if (assembly.rows.length === 0) {
        return res.status(404).json({ error: "Сборка не найдена" });
      }

      // Получаем подсборки
      const subAssemblies = await db.query(
        `SELECT * FROM assy WHERE parent_id = $1`,
        [id]
      );

      // Получаем детали
      const parts = await db.query(`SELECT * FROM part WHERE assy_id = $1`, [id]);

      // Формируем дерево
      const tree = {
        ...assembly.rows[0],
        children: subAssemblies.rows,
        parts: parts.rows,
      };

      res.json(tree);
    } catch (error) {
      console.error("Ошибка при получении дерева сборки:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  async searchAssy(req, res) {
    const term = req.query.term;
  
    if (!term) {
      return res.status(400).json({ error: "Не указан поисковый запрос" });
    }
  
    try {
      const result = await db.query(
        `SELECT * FROM assy WHERE designation ILIKE $1 OR name ILIKE $1`,
        [`%${term}%`]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Ошибка при поиске сборок:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

}

module.exports = new AssyController();