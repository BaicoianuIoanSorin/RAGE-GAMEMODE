import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	email: string;

	@Column()
	admin: number;

	@Column()
	helper: number;

	constructor(username: string, password: string, email: string, admin: number, helper: number) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.admin = admin;
		this.helper = helper;
	}
}
