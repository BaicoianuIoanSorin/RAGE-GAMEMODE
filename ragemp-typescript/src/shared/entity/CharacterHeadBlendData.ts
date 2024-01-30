import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CharacterEntity } from "./Character";

@Entity()
export class CharacterHeadBlendDataEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => CharacterEntity)
    @JoinColumn({ name: 'characterId' }) // Ensure the column name matches your database schema
    character: CharacterEntity;

    @Column({default: -1})
    // mother shape
    shapeFirstId: number;

    @Column({default: -1})
    // father shape
    shapeSecondId: number;
    // does not change anything - you can leave with 0
    
    @Column({default: -1})
    shapeThirdId: number;
    // mother skin color
    
    @Column({default: -1})
    skinFirstId: number;
    // father skin color
    
    @Column({default: -1})
    skinSecondId: number;
    // does not change anything - you can leave with 0
    
    @Column({default: -1})
    skinThirdId: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    
    @Column({default: -1})
    shapeMix: number;
    // 0 - more like mother, 1 - more like father
    // this varies from 0 to 1 as a float number
    
    @Column({default: -1})
    skinMix: number;
    // does not change anything - you can leave with 0
    
    @Column({default: -1})
    thirdMix: number;
    // this do not change anything - you can leave with false
    
    @Column({default: -1})
    isParent: boolean;

    constructor(character: CharacterEntity) {
        this.character = character;
    }
}