import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class CharacterComponentVariation {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' }) 
    user: User;

    componentId: number;
    drawableId: number;
    textureId: number;
    paletteId: number;

    constructor(user: User, componentId: number, drawableId: number, textureId: number, paletteId: number) {
        this.user = user;
        this.componentId = componentId;
        this.drawableId = drawableId;
        this.textureId = textureId;
        this.paletteId = paletteId;
    }
}