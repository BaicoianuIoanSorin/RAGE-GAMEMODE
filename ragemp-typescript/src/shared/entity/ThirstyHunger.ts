import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class ThirstyHunger {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({default: 100})
    thirstyLevel: number = 100;

    @Column({default: 100})
    hungryLevel: number = 100;

    constructor(user: User) {
        this.user = user;
    }
}
