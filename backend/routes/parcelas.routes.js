const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const XLSX = require("xlsx");
const upload = require("../middleware/upload");

/* =====================================
   GET PARCELAS
===================================== */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nombre,
        cultivo,
        estado,
        area,
        descripcion,
        dni,
        user_id,
        ST_AsGeoJSON(geom) AS geometry
      FROM parcelas
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo parcelas" });
  }
});

/* =====================================
   CREAR PARCELA MANUAL
===================================== */
router.post("/", auth, async (req, res) => {
  try {
    const {
      nombre,
      cultivo,
      estado,
      area,
      descripcion,
      dni,
      coordinates,
    } = req.body;

    const user_id = req.user.id;

    const geojson = JSON.stringify({
      type: "Polygon",
      coordinates: [coordinates],
    });

    const result = await pool.query(
      `
      INSERT INTO parcelas
      (nombre,cultivo,estado,area,descripcion,dni,user_id,geom)
      VALUES ($1,$2,$3,$4,$5,$6,$7,
      ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON($8),4326),
        32717
      ))
      RETURNING id
      `,
      [nombre, cultivo, estado, area, descripcion, dni, user_id, geojson]
    );

    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando parcela" });
  }
});

/* =====================================
   IMPORTAR GEOJSON COMPLETO
===================================== */
router.post("/import-geojson", auth, async (req, res) => {
  try {
    const geojson = req.body;

    if (!geojson.features) {
      return res.status(400).json({ error: "Formato inválido" });
    }

    for (const feature of geojson.features) {
      const { properties, geometry } = feature;

      await pool.query(
        `
        INSERT INTO parcelas
        (nombre,cultivo,estado,area,descripcion,dni,user_id,geom)
        VALUES ($1,$2,$3,$4,$5,$6,$7,
        ST_Transform(
          ST_SetSRID(ST_GeomFromGeoJSON($8),4326),
          32717
        ))
        `,
        [
          properties?.nombre || null,
          properties?.cultivo || null,
          properties?.estado || null,
          properties?.area || null,
          properties?.descripcion || null,
          properties?.dni || null,
          req.user.id,
          JSON.stringify(geometry),
        ]
      );
    }

    res.json({ ok: true, message: "Parcelas importadas correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error importando GeoJSON" });
  }
});

/* =====================================
   IMPORTAR EXCEL (CORREGIDO 🔥)
===================================== */
router.post(
  "/import-excel",
  auth,
  upload.single("file"),
  async (req, res) => {
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se envió archivo" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const row of rows) {

        /* ===== OPCIÓN 1: Excel con LAT / LON ===== */
        if (row.lat && row.lon) {
          await pool.query(
            `
            INSERT INTO parcelas
            (nombre,cultivo,estado,area,descripcion,dni,user_id,geom)
            VALUES ($1,$2,$3,$4,$5,$6,$7,
              ST_Transform(
                ST_Buffer(
                  ST_SetSRID(
                    ST_MakePoint($8,$9),
                    4326
                  ),
                  0.0001
                ),
                32717
              )
            )
            `,
            [
              row.nombre || null,
              row.cultivo || null,
              row.estado || null,
              row.area || null,
              row.descripcion || null,
              row.dni || null,
              req.user.id,
              row.lon,
              row.lat,
            ]
          );
        }

        /* ===== OPCIÓN 2: Excel con WKT (POLYGON(...)) ===== */
        else if (row.geometry) {
          await pool.query(
            `
            INSERT INTO parcelas
            (nombre,cultivo,estado,area,descripcion,dni,user_id,geom)
            VALUES ($1,$2,$3,$4,$5,$6,$7,
              ST_Transform(
                ST_SetSRID(
                  ST_GeomFromText($8),
                  4326
                ),
                32717
              )
            )
            `,
            [
              row.nombre || null,
              row.cultivo || null,
              row.estado || null,
              row.area || null,
              row.descripcion || null,
              row.dni || null,
              req.user.id,
              row.geometry,
            ]
          );
        }
      }

      res.json({ ok: true, message: "Excel importado correctamente" });

    } catch (err) {
      console.error("ERROR REAL:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* =====================================
   EDITAR GEOMETRIA
===================================== */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { geometry } = req.body;

    const check = await pool.query(
      "SELECT user_id FROM parcelas WHERE id=$1",
      [id]
    );

    if (check.rows.length === 0)
      return res.status(404).json({ error: "No encontrada" });

    const ownerId = check.rows[0].user_id;

    if (req.user.role !== "admin" && ownerId !== req.user.id) {
      return res.status(403).json({ error: "Sin permisos" });
    }

    await pool.query(
      `
      UPDATE parcelas
      SET geom = ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON($1),4326),
        32717
      )
      WHERE id=$2
      `,
      [JSON.stringify(geometry), id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando parcela" });
  }
});

module.exports = router;