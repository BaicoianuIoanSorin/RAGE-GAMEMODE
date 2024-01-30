import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { CharacterComponentVariation } from "./CharacterComponentVariation";
import { User } from "./User";

@Entity()
export class Character {
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}