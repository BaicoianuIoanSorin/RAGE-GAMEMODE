import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./User";

@Entity()
export class ThirstyHungerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({default: 100})
    thirstyLevel: number = 100;

    @Column({default: 100})
    hungryLevel: number = 100;

    constructor(user: UserEntity) {
        this.user = user;
    }
}
