import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user";
import { IsBoolean, Min, Max, IsOptional, Length } from "class-validator";

// Game with bots should be possible

@Entity()
export class Game {
  constructor(gameData?: Game) {
    if (gameData) {
      this.isPublic = gameData.isPublic;
      this.numPlayers = gameData.numPlayers;
      this.gameCode = gameData.gameCode;
      this.users = gameData.users;
      this.gameStarted = gameData.gameStarted;
      this.fieldWidth = gameData.fieldWidth;
      this.fieldHeight = gameData.fieldHeight;
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id?: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  public isPublic?: boolean;

  @Column({
    type: "int",
    nullable: false,
    default: 2,
  })
  @Min(2, {
    message: "Minimum 2 players required",
  })
  @Max(4, {
    message: "Maximum 4 players allowed",
  })
  // validate
  public numPlayers!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 4,
  })
  @Min(4)
  @Max(20)
  @IsOptional()
  public fieldWidth?: number;

  @Column({
    type: "int",
    nullable: false,
    default: 4,
  })
  @Min(4)
  @Max(20)
  @IsOptional()
  public fieldHeight?: number;

  @Column({
    type: "varchar",
    nullable: true,
    default: null,
  })
  @IsOptional()
  @Length(4, 255, {
    message: "Must be between 4 and 255 characters long",
  })
  public gameCode?: string | null;

  @ManyToMany(() => User)
  @JoinTable()
  public users!: User[];

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  public gameStarted?: boolean;

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;
}
