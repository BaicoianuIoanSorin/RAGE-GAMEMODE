import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./Character";

@Entity()
export class CharacterComponentVariation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Character)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: Character;

    componentId: number;
    drawableId: number;
    textureId: number;
    paletteId: number;

    constructor(character: Character) {
         this.character = character;
    }
}