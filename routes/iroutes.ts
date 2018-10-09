import * as express from "express";
import { StockData } from "../data/stockData";

export interface IRoute {
  readonly app: express.Application;
  stockData: StockData;
  launchRoutes(): void;
}
