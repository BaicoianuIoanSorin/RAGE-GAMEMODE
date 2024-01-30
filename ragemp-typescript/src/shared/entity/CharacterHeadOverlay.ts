import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CharacterEntity } from "./Character";

@Entity()
export class CharacterHeadOverlayEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @ManyToOne(() => CharacterEntity)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: CharacterEntity;

    @Column({default: -1})
    idHeadOverlay: number;

    @Column({default: -1})
    index: number;

    @Column({default: -1})
    opacity: number;

    @Column({default: -1})
    primaryColor: number;

    @Column({default: -1})
    secondaryColor: number;
    
    constructor(character: CharacterEntity) {
        this.character = character;
    }
}