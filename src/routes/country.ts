import { Router } from "express";
import { CountryModel, ICountry } from "../models/country";
import authenticate from "../middlewares/authenticate";

const routes = Router();

routes.get("/", authenticate, async (req, res) => {
  console.log(req.user, "user");
  try {
    const countries: ICountry[] = await CountryModel.find().exec();
    return res.json(countries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.post("/", authenticate, async (req, res) => {
  try {
    const country: ICountry = req.body;

    const countryExists = await CountryModel.findOne({
      name: country.name,
    }).exec();

    if (countryExists) {
      return res.status(409).json({ error: "There is already another country with this name" });
    }

    const newCountry = await CountryModel.create(country);
    return res.status(201).json(newCountry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default routes;
