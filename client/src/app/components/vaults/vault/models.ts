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
  id: string;
  vaultName: string;
  createdAt: Date;
  createdBy: string;
  modifiedDate: Date;
  modifiedBy: string
  rows: VaultRow[];
  role: string

  constructor(name: string, userEmail: string) {
    this.vaultName = name;
    this.rows = []
    this.role = 'CREATOR';
    this.modifiedDate = null;
    this.modifiedBy = null;
  }
}

export interface VaultResponse {
  id: string,
  data: object,
  role: string,
  key: string,
  modifiedBy: string,
  modifiedDate: Date,
  createdBy: string,
  createdDate: Date,

}
