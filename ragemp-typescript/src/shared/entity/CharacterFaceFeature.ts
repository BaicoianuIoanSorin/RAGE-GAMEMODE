import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class CharacterFaceFeature {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	faceFeatureId: number;
	scale: number;

    constructor(user: User, faceFeatureId: number, scale: number) {
        this.user = user;
        this.faceFeatureId = faceFeatureId;
        this.scale = scale;
    }
}
