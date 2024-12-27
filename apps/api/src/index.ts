import { createServer } from "./server";
import { log } from "@repo/logger";
import { getAppDataSource, ensureDatabaseExists } from "@repo/db";
import { DataSource } from "typeorm";
import 'dotenv/config';

const port = process.env.PORT || 3001;
const server = createServer();
let dataSource:DataSource|null = null;
ensureDatabaseExists().then(() => {
  console.log("The password is: ",process.env.DB_USERNAME);
  dataSource = getAppDataSource();
  dataSource?.initialize();
});


server.listen(port, () => {
  log(`api running on ${port}`);
});
