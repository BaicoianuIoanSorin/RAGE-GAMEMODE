import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from './Character';

@Entity()
export class CharacterFaceFeature {
	@PrimaryGeneratedColumn()
	id: number;
	
    @OneToOne(() => Character)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: Character;

	faceFeatureId: number;
	scale: number;

    constructor(character: Character) {
        this.character = character;
    }
}
