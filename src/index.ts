import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cors from "cors";
import tenantRoutes from "./routes/tenant";

const app = express();
const port = process.env.PORT || 3333;

dotenv.config();
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
/* app.use(express.text({ type: "text/html" })); */
app.use(cors());

app.get("/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use("/countries", countryRoutes);
app.use("/tenants", tenantRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
