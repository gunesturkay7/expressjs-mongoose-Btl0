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
