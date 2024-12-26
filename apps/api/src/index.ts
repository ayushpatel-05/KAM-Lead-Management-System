import { createServer } from "./server";
import { log } from "@repo/logger";
import { getAppDataSource, ensureDatabaseExists } from "@repo/db";
import { DataSource } from "typeorm";
import 'dotenv/config';

const port = process.env.PORT || 3001;
const server = createServer();
let appDataSource:DataSource|null = null;
ensureDatabaseExists().then(async () => {
  console.log("The password is: ",process.env.DB_USERNAME);
  appDataSource = await getAppDataSource();
});


server.listen(port, () => {
  log(`api running on ${port}`);
});
