import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PlayerStats } from "../../gamelogic/Player";

@Entity()
@Index(["gameId", "userId"])
export class GameUserStats {
  constructor(gameId: string, userId: string, stats: PlayerStats) {
    this.gameId = gameId;
    this.userId = userId;
    this.enemyFleetsDestroyed = stats.enemyFleetsDestroyed;
    this.enemyShipsDestroyed = stats.enemyShipsDestroyed;
    this.shipCount = stats.shipCount;
    this.isDead = stats.isDead;
  }

  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    type: "uuid",
    nullable: false,
  })
  public gameId!: string;

  @Column({
    type: "uuid",
    nullable: false,
  })
  public userId!: string;

  // stats
  @Column({
    type: "int",
    nullable: false,
    default: 0,
  })
  public enemyShipsDestroyed!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 0,
  })
  public enemyFleetsDestroyed!: number;

  @Column({
    type: "int",
    nullable: false,
    default: 0,
  })
  public shipCount!: number;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  public isDead!: boolean;

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;
}
