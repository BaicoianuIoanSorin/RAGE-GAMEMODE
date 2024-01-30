import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class CharacterHeadBlendData {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

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

    constructor(user: User, shapeFirstId: number, shapeSecondId: number, shapeThirdId: number, skinFirstId: number, skinSecondId: number, skinThirdId: number, shapeMix: number, skinMix: number, thirdMix: number, isParent: boolean) {   
        this.user = user;
        this.shapeFirstId = shapeFirstId;
        this.shapeSecondId = shapeSecondId;
        this.shapeThirdId = shapeThirdId;
        this.skinFirstId = skinFirstId;
        this.skinSecondId = skinSecondId;
        this.skinThirdId = skinThirdId;
        this.shapeMix = shapeMix;
        this.skinMix = skinMix;
        this.thirdMix = thirdMix;
        this.isParent = isParent;
    }
}