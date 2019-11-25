import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { throwError } from 'rxjs';
import { User } from '../user/models/user';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getMovies(query?: any) {
    let url = 'http://localhost:3000/movies';
    if (query && query.target.value) {
      url = 'http://localhost:3000/movies/' + query.target.value;
    }
    return this.http.get(url).
        pipe(
           map((data: Movie[]) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
    }

    getUsers(query?: any) {
      let url = 'http://localhost:3000/users';
      if (query && query.target.value) {
        url = 'http://localhost:3000/users/' + query.target.value;
      }
      return this.http.get(url).
          pipe(
             map((data: User[]) => {
               return data;
             }), catchError( error => {
               return throwError( 'Something went wrong!' );
             })
          );
      }
}
