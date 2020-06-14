import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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
      this.activationCode = newUser.activationCode;
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

  @Index()
  @Column({ type: "text", unique: true })
  @IsEmail()
  @IsOptional()
  public email!: string;

  @Column("text")
  public password!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  public isActive?: boolean;

  @Index()
  @Column({
    type: "uuid",
    nullable: true,
  })
  public activationCode?: string | null;

  @ManyToMany(() => Game)
  @JoinTable()
  public games?: Game[];

  // password reset info
  @Column({ type: "text", nullable: true })
  public passwordResetToken?: string | null;

  @Column({ type: "datetime", nullable: true })
  public passwordResetTokenExpiresAt?: Date | null;

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;
}
