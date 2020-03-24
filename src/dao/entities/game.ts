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
  id: string | undefined;

  @ManyToMany((type) => User)
  @JoinTable()
  users: User[] | undefined;

  @Column({
    type: "text",
    enum: GameStatus,
    default: GameStatus.NOT_STARTED,
  })
  status: GameStatus | undefined;
}
