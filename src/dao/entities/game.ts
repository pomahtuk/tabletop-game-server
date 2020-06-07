import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
} from "typeorm";

import { User } from "./user";

export enum GameStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToMany(() => User)
  @JoinTable()
  public users!: User[];

  @Column({
    type: "text",
    enum: GameStatus,
    default: GameStatus.NOT_STARTED,
  })
  public status!: GameStatus;
}
