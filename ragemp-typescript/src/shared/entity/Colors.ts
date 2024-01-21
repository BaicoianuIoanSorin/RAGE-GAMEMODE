import { Entity, PrimaryGeneratedColumn } from "typeorm";


// TODO to move colors in DB
@Entity()
export class Character {
    @PrimaryGeneratedColumn()
    id: number;

    hexColor: string;

    constructor(hexColor: string) {
        this.hexColor = hexColor;
    }
}