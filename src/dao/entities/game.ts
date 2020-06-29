import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user";
import { IsBoolean, IsOptional, Length, Max, Min } from "class-validator";
import { PlanetMap } from "../../gamelogic/Planet";
import Fleet from "../../gamelogic/Fleet";
import { PlayerTurn } from "../../gamelogic/Player";
import ComputerPlayer from "../../gamelogic/ComputerPlayer";
import { GameStatus } from "../../gamelogic/Game";

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
  @Column({ type: "simple-json", default: [] })
  public players?: (User | ComputerPlayer)[];

  @Column({ type: "simple-json", default: {} })
  public planets?: PlanetMap;

  @Column({ type: "simple-json", default: [] })
  public fleetTimeline?: Fleet[][];

  @Column({ type: "simple-json", default: [] })
  public turns?: PlayerTurn[];

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  // helpers
  public get fieldSize(): [number, number] {
    return [this.fieldHeight ?? 0, this.fieldWidth ?? 0];
  }

  public get status(): GameStatus {
    if (!this.gameStarted) {
      return GameStatus.NOT_STARTED;
    }

    if (this.gameCompleted) {
      return GameStatus.COMPLETED;
    }

    return GameStatus.IN_PROGRESS;
  }

  public set status(status: GameStatus) {
    switch (status) {
      case GameStatus.COMPLETED:
        this.gameCompleted = true;
        this.gameStarted = true;
        break;
      case GameStatus.IN_PROGRESS:
        this.gameStarted = true;
        this.gameCompleted = false;
        break;
      case GameStatus.NOT_STARTED:
        this.gameStarted = false;
        this.gameCompleted = false;
    }
  }
}
