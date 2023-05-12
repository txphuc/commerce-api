import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
export class Base extends BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP()',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  deletedAt?: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: number;

  setCreatedUser(userId: number) {
    this.createdBy = userId;
    this.updatedBy = userId;
  }

  setUpdatedUser(userId: number) {
    this.updatedBy = userId;
    this.updatedAt = new Date();
  }
}
