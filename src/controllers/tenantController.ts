import { Request, Response } from "express";
import { Tenant } from "../models/tenant";

export const createTenant = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const newTenant = new Tenant({
      ...req.body,
      user: req.user._id,
    });
    await newTenant.save();
    res.status(201).json(newTenant);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTenants = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const tenants = await Tenant.find({ user: req.user._id });
    console.log(tenants);
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const calculateResultText = (resultNumber: number): string => {
  if (resultNumber < 50) {
    return "Kötü";
  } else if (resultNumber < 70) {
    return "Orta";
  } else if (resultNumber < 85) {
    return "İyi";
  } else {
    return "Çok iyi";
  }
};

export const getResult = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  // Telefon numarasına göre tenant'ı bul
  const tenant = await Tenant.findOne({ contactNumber: phoneNumber });

  if (!tenant) {
    return res.status(404).send("Tenant not found.");
  }

  // 0 ile 100 arasında rastgele bir sayı oluştur
  const resultNumber = Math.floor(Math.random() * 101);
  const resultText = calculateResultText(resultNumber);

  // tenant, resultNumber ve resultText değerlerini JSON olarak dön
  res.json({ tenant, resultNumber, resultText });
};
