const db = require('../db');

class PartController {
  async createPart(req, res) {
    const { designation, name, material, assy_id } = req.body;
    const newPart = await db.query(
      `INSERT INTO part (designation, name, material, assy_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [designation, name, material, assy_id]
    );
    res.json(newPart.rows[0]);
  }

  async getParts(req, res) {
    const parts = await db.query(`SELECT * FROM part`);
    res.json(parts.rows);
  }

  async getOnePart(req, res) {
    const id = req.params.id;
    const part = await db.query(`SELECT * FROM part WHERE id = $1`, [id]);
    res.json(part.rows[0]);
  }

  async updatePart(req, res) {
    const { designation, name, material, assy_id } = req.body;
    const id = req.params.id;
    const part = await db.query(
      `UPDATE part SET designation = $1, name = $2, material = $3, assy_id = $4 WHERE id = $5 RETURNING *`,
      [designation, name, material, assy_id, id]
    );
    res.json(part.rows[0]);
  }

  async deletePart(req, res) {
    const id = req.params.id;
    const part = await db.query(`DELETE FROM part WHERE id = $1 RETURNING *`, [id]);
    res.json(part.rows[0]);
  }
}

module.exports = new PartController();