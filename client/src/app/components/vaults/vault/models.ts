export class VaultRow {
  name: string;
  username: string;
  password: string;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}

export class Vault{
  vaultName: string;
  rows: VaultRow[];

  constructor(name: string) {
    this.vaultName = name;
    this.rows = []
  }
}

export class VaultResponse {
  id: string;
  data: Vault;
  role: string;
  key: string;
  modifiedBy: string;
  modifiedDate: Date;
  createdBy: string;
  createdDate: Date;

}
