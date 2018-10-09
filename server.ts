import * as express from "express";
import { StockData } from "./data/stockData";
import { ChatRoutes } from "./routes/chat";
import { IRoute } from "./routes/iroutes";
import { UserRoutes } from "./routes/users";

class Server {
    public readonly app: express.Application;
    private stockData: StockData;
    private readonly routes: IRoute[];

    constructor() {
        this.app = express();
        this.app.listen(3000, () => {
            console.log("Server online, ready to serve !");
        });
        this.stockData = new StockData();
        this.routes = [new UserRoutes(this.app, this.stockData), new ChatRoutes(this.app, this.stockData)];
    }
}

const server = new Server();
