import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

import { User } from "./user";

@Entity()
export class Game {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToMany(() => User)
  @JoinTable()
  public users!: User[];
}
