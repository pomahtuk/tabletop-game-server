import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./user";
import { IsBoolean, Min, Max, IsOptional, Length } from "class-validator";
import Planet, { PlanetMap } from "../../gamelogic/Planet";
import Fleet from "../../gamelogic/Fleet";
import Player, { PlayerTurn } from "../../gamelogic/Player";

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
      this.waitingForPlayer = gameData.waitingForPlayer;
      this.winner = gameData.winner;
      this.planets = gameData.planets;
      this.fleetTimeline = gameData.fleetTimeline;
      this.turns = gameData.turns;
      this.players = gameData.players;
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

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  public gameCompleted?: boolean;

  @Column({
    type: "int",
    nullable: false,
    default: -1,
  })
  public waitingForPlayer?: number;

  @OneToOne((type) => User)
  @JoinColumn()
  public winner?: User;

  // TODO: may be switch to proper JSON?
  @Column("simple-json")
  public players?: Player[];

  @Column("simple-json")
  public planets?: PlanetMap;

  @Column("simple-json")
  public fleetTimeline?: Fleet[][];

  @Column("simple-json")
  public turns?: PlayerTurn[];

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;
}
