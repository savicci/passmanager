export class VaultRow {
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;

  constructor() {
    this.name = '';
    this.username = '';
    this.password = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.updatedBy = '';
  }
}

export class Vault{
  vaultName: string;
  createdAt: Date;
  rows: VaultRow[];

  constructor(vaultName: string) {
    this.vaultName = vaultName;
    this.createdAt = new Date();
    this.rows = [];
  }
}
