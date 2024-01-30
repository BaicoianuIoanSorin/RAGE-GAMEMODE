import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./Character";

@Entity()
export class CharacterHeadOverlay {
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToOne(() => Character)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: Character;

    idHeadOverlay: number;
    index: number;
    opacity: number;
    primaryColor: number;
    secondaryColor: number;
    
    constructor(character: Character) {
        this.character = character;
    }
}