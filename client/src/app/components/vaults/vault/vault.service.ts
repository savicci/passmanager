import { Injectable } from '@angular/core';
import {Vault} from "./models";

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor() { }

  public createNewVault(name: string){
    return new Vault(name);
  }
}
