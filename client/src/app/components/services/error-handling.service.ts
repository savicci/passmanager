import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private snackBar: MatSnackBar, private router: Router) {
  }

  handleHttpError(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.snackBar.open('Your session has expired. Please log in again', null, {duration: 3000});
      localStorage.removeItem('authenticated');
      this.router.navigate(['/login']);
    } else if (err.status === 403) {
      this.snackBar.open('You are not allowed to execute this operation', null, {duration: 2000});
    } else if (err.status === 404) {
      this.snackBar.open('Requested resource was not found', null, {duration: 2000})
    } else {
      this.snackBar.open('Unknown error. Check console for additional info', null, {duration: 1500});
      console.warn(err);
    }
  }

  handleEncryptionError(errorMessage: string, err: any) {
    this.snackBar.open(errorMessage, null, {duration: 2000})
    console.error(err);
    throw err;
  }
}
