import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./User";

@Entity()
export class CharacterEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    constructor(user: UserEntity) {
        this.user = user;
    }
}