export class VaultRow {
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;

}

export class Vault{
  key: string
  id: number;
  vaultName: string;
  createdAt: Date;
  createdBy: string;
  modifiedDate: Date;
  modifiedBy: string
  rows: VaultRow[];
  role: string

  constructor(name: string, userEmail: string) {
    this.vaultName = name;
    this.createdAt = new Date();
    this.modifiedDate = new Date();
    this.createdBy = userEmail;
    this.modifiedBy = userEmail;
    this.rows = []
  }
}
