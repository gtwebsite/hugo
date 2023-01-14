import * as csv from "fast-csv";
import type { Request, Response } from "express";
import { Prisma, Vehicle } from "@prisma/client";
import prisma from "./client";

export class DataStore {
  upload(
    req: Request,
    res: Response,
    callback?: (value: Prisma.Prisma__VehicleClient<Vehicle, never>[]) => void
  ): Response<any, Vehicle | {}> | undefined {
    if (!req.file) {
      return res.status(500).json({ message: "CSV file required" } as Error);
    }

    const fileToString = req.file.buffer.toString();

    const csvData: Prisma.VehicleCreateInput[] = [];

    csv
      .parseString(fileToString, { headers: true })
      .on("data", (data: Record<string, string>) => {
        csvData.push({
          uuid: data.UUID,
          vin: data.VIN,
          make: data?.Make || null,
          model: data?.Model || null,
          mileage: data?.Mileage ? parseInt(data.Mileage) : null,
          year: data?.Year ? parseInt(data.Year) : null,
          price: data?.Price ? parseInt(data.Price) : null,
          zip: data["Zip Code"] || null,
          dateCreated: data["Create Date"]
            ? new Date(data["Create Date"])
            : undefined,
          dateUpdated: data["Update Date"]
            ? new Date(data["Update Date"])
            : undefined,
        });
      })
      .on("end", async () => {
        const out = await this.upSert(csvData);
        callback && callback(out);
        res.status(200).json(out);
        res.end();
      });
  }

  async upSert(csvData: Prisma.VehicleCreateInput[]) {
    if (csvData.length <= 0) {
      return [];
    }

    return await prisma.$transaction(async () =>
      csvData.map((data) =>
        prisma.vehicle.upsert({
          where: { uuid: data.uuid },
          update: {
            ...data,
            dateUpdated: data.dateUpdated || new Date(),
          },
          create: data,
        })
      )
    );
  }
}
