import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity
} from "typeorm";

@Entity()
@Unique(["username"])
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
