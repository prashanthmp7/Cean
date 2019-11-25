import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css']
})
export class CreateMovieComponent implements OnInit {
  public movie: any;
  constructor(private router: Router, private http: HttpClient, private location: Location) {
    this.movie = {
      name: '',
      genre: '',
      formats: {
        digital: false,
        bluray: false,
        dvd: false
      }
    };
  }

  ngOnInit() {
  }
  public save() {
    if (this.movie.name && this.movie.genre) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post('http://localhost:3000/movies', JSON.stringify(this.movie), httpOptions)
        .subscribe(result => {
          this.location.back();
        });
    }
  }
}
