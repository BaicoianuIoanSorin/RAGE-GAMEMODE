import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false})
    isLoggedIn: boolean = false;

    @Column({ 
        type: 'datetime', 
        default: () => 'CURRENT_TIMESTAMP' 
    })
    lastLoggedIn: Date;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 0 }) // Default value for admin
    admin: number = 0;

    @Column({ default: 0 }) // Default value for helper
    helper: number = 0;

    constructor(username: string, password: string, email: string) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

