import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CharacterEntity } from "./Character";

@Entity()
export class CharacterComponentVariationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CharacterEntity)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: CharacterEntity;

    @Column({default: -1})
    componentId: number;

    @Column({default: -1})
    drawableId: number;

    @Column({default: -1})
    textureId: number;

    @Column({default: -1})
    paletteId: number;

    constructor(character: CharacterEntity) {
         this.character = character;
    }
}