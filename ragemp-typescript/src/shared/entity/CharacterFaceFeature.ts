import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterEntity } from './Character';

@Entity()
export class CharacterFaceFeatureEntity {
	@PrimaryGeneratedColumn()
	id: number;
	
    @ManyToOne(() => CharacterEntity)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: CharacterEntity;

    @Column({default: -1})
	faceFeatureId: number;

    @Column({default: -1})
	scale: number;

    constructor(character: CharacterEntity) {
        this.character = character;
    }
}
