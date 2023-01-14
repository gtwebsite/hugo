import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from "node-mocks-http";
import { DataStore } from "./datastore";
import { prismaMock } from "./singleton";

describe("DataStore", () => {
  let mockRequest: MockRequest<Request>;
  let mockResponse: MockResponse<Response>;

  let dataStore: DataStore;
  let vehiclesCsv: Prisma.VehicleCreateInput[];
  let vehiclesCsvToString: String;

  beforeEach(() => {
    mockResponse = createResponse();

    dataStore = new DataStore();

    vehiclesCsv = [
      {
        uuid: "29505105-077c-479f-8c95-d879c2c96abc",
        vin: "001A",
        make: "Toyota",
        model: "Rav4",
        mileage: 12000,
        year: 1990,
        price: 56000,
        zip: "60007-02",
        dateCreated: "2022-05-19T09:26:00.000Z",
        dateUpdated: "2022-05-19T09:26:00.000Z",
      },
      {
        uuid: "5429c96c-e99c-4ed6-a15b-6745c2239cc7",
        vin: "002B",
        make: "Nissan",
        model: "Sentra",
        mileage: 13800,
        year: null,
        price: null,
        zip: null,
        dateCreated: "2023-01-13T03:16:27.020Z",
        dateUpdated: "2023-01-13T03:16:27.020Z",
      },
    ];

    const topLine = Object.keys(vehiclesCsv[0]).join(",");
    const lines = vehiclesCsv.reduce(
      (acc, val) => acc.concat(Object.values(val).join(`,`) as any),
      []
    );
    vehiclesCsvToString = topLine.concat(`\n${lines.join(`\n`)}`);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("upload", () => {
    it("should return a 500 error if req.file is undefined", () => {
      mockRequest = createRequest({
        method: "GET",
        url: "/",
      });

      dataStore.upload(mockRequest, mockResponse);

      expect(mockResponse._getStatusCode()).toEqual(500);
      expect(mockResponse._getJSONData()).toEqual({
        message: "CSV file required",
      });
    });

    it("should parse the file and return the data", (done) => {
      prismaMock.$transaction.mockResolvedValue(vehiclesCsv);

      mockRequest = createRequest({
        method: "GET",
        url: "/",
        file: {
          buffer: Buffer.from(vehiclesCsvToString),
        },
      });

      dataStore.upload(mockRequest, mockResponse, (vehicles) => {
        expect(vehicles).toEqual(vehiclesCsv);
        done();
      });

      expect(mockResponse._getStatusCode()).toEqual(200);
    });
  });

  describe("upSert", () => {
    it("should return an empty array if games is empty", async () => {
      prismaMock.$transaction.mockResolvedValue([]);
      await expect(dataStore.upSert([])).resolves.toEqual([]);
    });

    it("should return the correct values from prisma transactions of upsert", async () => {
      prismaMock.$transaction.mockResolvedValue(vehiclesCsv);
      await expect(dataStore.upSert(vehiclesCsv)).resolves.toEqual(vehiclesCsv);
    });
  });
});
