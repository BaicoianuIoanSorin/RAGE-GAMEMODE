import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class CharacterHeadOverlay {
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    idHeadOverlay: number;
    index: number;
    opacity: number;
    primaryColor: number;
    secondaryColor: number;
    
    constructor(user: User, idHeadOverlay: number, index: number, opacity: number, primaryColor: number, secondaryColor: number) {
        this.user = user;
        this.idHeadOverlay = idHeadOverlay;
        this.index = index;
        this.opacity = opacity;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }
}