import { DataSource } from "typeorm";
import { User } from "@shared/entity/User";
import { ThirstyHunger } from "@shared/entity/ThirstyHunger";
import { Character } from "@shared/entity/Character";

// Configure the data source with your connection options
export const AppDataSource = new DataSource({
    type: "mysql", // or "mysql", "mariadb", "sqlite", etc., depending on your database
    host: "localhost",
    port: 3306, // or your database port
    username: "admin",
    password: "adminparola",
    database: "ragemp_server_2025_v2",
    entities: [User, ThirstyHunger, Character], // Include your entity models here
    synchronize: true, // Note: Only use in development environment!
    logging: true,
	driver: require('mysql2'),
});

// Connect to the database and perform operations
AppDataSource.initialize()
    .then(async () => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.log(error);
    });
