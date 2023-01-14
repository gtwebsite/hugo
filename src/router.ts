import express from "express";
import multer from "multer";
import { DataStore } from "./datastore";

export const router = express.Router();
export const datastore = new DataStore();

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    datastore.upload(req, res);
  } catch (e) {
    res.status(500).send(e as unknown as Error);
  }
});
