import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user";
import { PlanetMap } from "../../gamelogic/Planet";
import Fleet from "../../gamelogic/Fleet";
import { Player, PlayerTurn } from "../../gamelogic/Player";
import { GameStatus } from "../../gamelogic/Game";

@Entity()
export class Game {
  constructor() {
    this.playersObj = { players: [] };
    this.planets = {};
    this.fleetTimelineObj = { fleetTimeline: [] };
    this.turnsObj = { turns: [] };
  }

  @PrimaryGeneratedColumn("uuid")
  public id?: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: true,
  })
  public isPublic?: boolean;

  @Column({
    type: "int",
    nullable: false,
    default: 2,
  })
  public numPlayers!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 4,
  })
  public fieldWidth!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 4,
  })
  public fieldHeight!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 0,
  })
  public neutralPlanetCount!: number;

  @Column({
    type: "varchar",
    nullable: true,
    default: null,
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
  public gameStarted?: boolean;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  public gameCompleted?: boolean;

  @Column({
    type: "int",
    nullable: false,
    default: -1,
  })
  public waitingForPlayer!: number;

  @Column({
    type: "uuid",
    nullable: true,
    default: null,
  })
  public winnerId?: string | null;

  // TODO: may be switch to proper JSON?
  @Column({ type: "simple-json" })
  public playersObj!: { players: Player[] };

  @Column({ type: "simple-json" })
  public planets!: PlanetMap;

  @Column({ type: "simple-json" })
  public fleetTimelineObj!: { fleetTimeline: Fleet[][] };

  @Column({ type: "simple-json" })
  public turnsObj!: { turns: PlayerTurn[] };

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  // post data
  public initialPlayers?: PlayerIndexMap;

  // helpers
  public get fieldSize(): [number, number] {
    return [this.fieldHeight, this.fieldWidth];
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
      default:
        // we are ignoring GameStatus.NOT_STARTED as we dont' expect this to be set programmatically
        break;
    }
  }
}

export interface PlayerIndexMap {
  [index: string]: Player;
}
