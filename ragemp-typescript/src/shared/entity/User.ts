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

	constructor(username: string, password: string, email: string) {
		this.username = username;
		this.password = password;
		this.email = email;
	}
}
