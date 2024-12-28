import "reflect-metadata";
import { DataSource } from "typeorm";
import pg from "pg";
import "dotenv/config"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "test",
  synchronize: false, // use migrations instead
  logging: true,
  entities: [`${process.env.NODE_ENV == 'production' ? "dist" : "src"}/entity/*.ts`], // Path to entities.
  migrations: [`${process.env.NODE_ENV == 'production' ? "dist" : "src"}/migration/*.ts`], // Path to migrations.
  subscribers: [`${process.env.NODE_ENV == 'production' ? "dist" : "src"}/subscriber/*.ts`], // Path to subscribers.
});
// let appDataSourceInstance:DataSource|null = null;

// export const getAppDataSource = () => {
//     if (!appDataSourceInstance) {
//       appDataSourceInstance = new DataSource({
//         type: "postgres",
//         host: process.env.DB_HOST || "localhost",
//         port: parseInt(process.env.DB_PORT || "5432"),
//         username: process.env.DB_USERNAME || "postgres",
//         password: process.env.DB_PASSWORD || "password",
//         database: process.env.DB_NAME || "test",
//         synchronize: false, // use migrations instead
//         logging: true,
//         entities: ["entity/**/*.[ts,js]"],
//         migrations: ["migration/**/*.[ts,js]"],
//         subscribers: ["subscriber/**/*.[ts,js]"],
//       });
  
//     //   try {
//     //     await appDataSourceInstance.initialize();
//     //     console.log("Data Source has been initialized!");
//     //   } catch (error) {
//     //     console.error("Error during Data Source initialization:", error);
//     //     throw error;
//     //   }
//     }
  
//     return appDataSourceInstance;
//   };
  

// Create database if it doesn't exist.
export const ensureDatabaseExists = async function ensureDatabaseExists() {
    
    const client = new pg.Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    console.log("The password from data source is: ", process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USERNAME, client.password, client.host, client.port, client.user);
    try {
      await client.connect();
      
      const dbName = process.env.DB_NAME;
  
      const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
  
      if (res.rowCount === 0) {
        console.log(`Database "${dbName}" does not exist. Creating...`);
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database "${dbName}" created successfully.`);
      } else {
        console.log(`Database "${dbName}" already exists.`);
      }
    } catch (error) {
      console.error("Error ensuring database existence:", error);
      process.exit(1);
    } finally {
      await client.end();
    }
  }
  