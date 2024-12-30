import { createServer } from "./server";
import { log } from "@repo/logger";
import { AppDataSource, ensureDatabaseExists } from "@repo/db";
import { DataSource } from "typeorm";
import UserRouter from "./modules/user/user.route";
import 'dotenv/config';
import errorHandler from "./middleware/errorHandler";

const port = process.env.PORT || 3001;
const server = createServer();
let dataSource:DataSource|null = null;
ensureDatabaseExists().then(() => {
  console.log("The password is: ",process.env.DB_USERNAME);
  // dataSource = AppDataSource;
  AppDataSource?.initialize();
});

server.use(UserRouter);

server.use(errorHandler);

server.listen(port, () => {
  log(`api running on ${port}`);
});
