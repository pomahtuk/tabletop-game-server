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
import { Player, PlayerStats } from "../../gamelogic/Player";

export interface UserData {
  username: string;
  password: string;
  email: string;
  games?: Game[];
  activationCode?: string;
}

@Entity()
export class User implements Player {
  // no need to store this in DB
  public isComputer: boolean = false;

  public stats?: PlayerStats;

  constructor(newUser?: UserData) {
    this.isComputer = false;
    if (newUser) {
      this.username = newUser.username;
      this.password = newUser.password;
      this.email = newUser.email;
      this.games = newUser.games;
      this.activationCode = newUser.activationCode;
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Index("username", { unique: true })
  @Column({ type: "varchar", length: 255 })
  @Length(4, 255, {
    message: "Must be between 4 and 255 characters long",
  })
  @Matches(/^([a-zA-Z0-9\.\!\@\$\&\~\_])+$/, {
    message: "Can only contain numbers, letters and symbols: . ! @ $ & ~ _",
  })
  @IsOptional()
  public username!: string;

  @Index("email", { unique: true })
  @Column({ type: "varchar", length: 255 })
  @IsEmail()
  @IsOptional()
  public email!: string;

  @Column("varchar")
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
