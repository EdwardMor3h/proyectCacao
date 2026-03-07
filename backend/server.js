const express = require("express");
const cors = require("cors");

const parcelasRoutes = require("./routes/parcelas.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 RUTAS API
app.use("/api/auth", authRoutes);
app.use("/api/parcelas", parcelasRoutes);

// ⭐ RUTA PRINCIPAL (ESTA FALTABA)
app.get("/", (req, res) => {
  res.send("Backend GeoCacao funcionando 🚀");
});

app.listen(3001, () => {
  console.log("🚀 Backend corriendo en puerto 3001");
});
