import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Game } from "./game";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column("text")
  firstName: string | undefined;

  @Column("text")
  lastName: string | undefined;

  @ManyToMany((type) => Game)
  @JoinTable()
  games: Game[] | undefined;
}
