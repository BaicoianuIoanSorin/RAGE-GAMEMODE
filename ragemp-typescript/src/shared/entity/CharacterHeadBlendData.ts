import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./Character";

@Entity()
export class CharacterHeadBlendData {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => Character)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: Character;

    // mother shape
    shapeFirstId: number;
    // father shape
    shapeSecondId: number;
    // does not change anything - you can leave with 0
    shapeThirdId: number;
    // mother skin color
    skinFirstId: number;
    // father skin color
    skinSecondId: number;
    // does not change anything - you can leave with 0
    skinThirdId: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    shapeMix: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    skinMix: number;
    // does not change anything - you can leave with 0
    thirdMix: number;
    // this do not change anything - you can leave with false
    isParent: boolean;

    constructor(character: Character) {
        this.character = character;
    }
}