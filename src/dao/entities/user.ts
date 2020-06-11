import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Game } from "./game";
import { IsEmail, IsOptional, Length, Matches } from "class-validator";

@Entity()
export class User {
  constructor(newUser?: User) {
    if (newUser) {
      this.username = newUser.username;
      this.password = newUser.password;
      this.email = newUser.email;
      this.games = newUser.games;
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id?: string;

  @Column({ type: "text", unique: true })
  @Length(4, 255, {
    message: "Must be between 4 and 255 characters long",
  })
  @Matches(/^([a-zA-Z0-9\.\!\@\$\&\~\_])+$/, {
    message: "Can only contain numbers, letters and symbols: . ! @ $ & ~ _",
  })
  @IsOptional()
  public username!: string;

  @Column({ type: "text", unique: true })
  @IsEmail()
  @IsOptional()
  public email!: string;

  @Column("text")
  @Length(6, 255, {
    message: "Must be between 6 and 255 characters long",
  })
  @Matches(
    /^([a-zA-Z0-9\*\.\!\#\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|\\])+$/,
    {
      message:
        "Can only contain numbers, letters and symbols: * . ! # @ $ % ^ & ( ) [ ] : ; < > , . ?  ~ _ + - = | /",
    }
  )
  @IsOptional()
  public password!: string;

  @ManyToMany(() => Game)
  @JoinTable()
  public games?: Game[];

  // password reset info
  @Column({ type: "text", nullable: true })
  public passwordResetToken?: string;

  @Column({ type: "datetime", nullable: true })
  public passwordResetTokenExpiresAt?: Date;

  // Technical info
  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
