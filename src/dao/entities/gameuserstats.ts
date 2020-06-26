import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Index(["gameId", "userId"])
export class GameUserStats {
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

  // Technical info
  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;
}
