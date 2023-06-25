import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    const url = 'https://jsonplaceholder.typicode.com/users'; // URL da API RESTful de terceiros

    return this.http.get<User[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Erro na solicitação HTTP:', error);
        return throwError(() =>'Ocorreu um erro ao obter os usuários.');
      })
    );
  }
}
