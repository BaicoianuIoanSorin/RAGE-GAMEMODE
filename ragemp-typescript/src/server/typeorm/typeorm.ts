import { DataSource } from 'typeorm';
import { UserEntity } from '@shared/entity/User';
import { ThirstyHungerEntity } from '@shared/entity/ThirstyHunger';
import { CharacterComponentVariationEntity } from '@shared/entity/CharacterComponentVariation';
import { CharacterFaceFeatureEntity } from '@shared/entity/CharacterFaceFeature';
import { CharacterHeadBlendDataEntity } from '@shared/entity/CharacterHeadBlendData';
import { CharacterHeadOverlayEntity } from '@shared/entity/CharacterHeadOverlay';
import { CharacterEntity } from '@shared/entity/Character';

// Configure the data source with your connection options
export const AppDataSource = new DataSource({
	type: 'mysql', // or "mysql", "mariadb", "sqlite", etc., depending on your database
	host: 'localhost',
	port: 3306, // or your database port
	username: 'admin',
	password: 'adminparola',
	database: 'ragemp_server_2025_v2',
	entities: [UserEntity, ThirstyHungerEntity, CharacterEntity, CharacterComponentVariationEntity, CharacterFaceFeatureEntity, CharacterHeadBlendDataEntity, CharacterHeadOverlayEntity], // Include your entity models here
	synchronize: true, // Note: Only use in development environment!
	logging: true,
	driver: require('mysql2')
});

// Connect to the database and perform operations
AppDataSource.initialize()
	.then(async () => {
		console.log('Connected to database');
	})
	.catch((error) => {
		console.log(error);
	});
