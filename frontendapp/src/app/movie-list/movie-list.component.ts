import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// tslint:disable-next-line: import-blacklist
import 'rxjs';
import { map } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import { AuthenticationService } from '../services/authentication.service';



@Component({
  selector: 'app-movies',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  public movies: any;
  constructor(private router: Router,
              private movieService: MovieService,
              private location: Location,
              private authService: AuthenticationService) {
    this.movies = [];
  }

  ngOnInit() {
    this.location.subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  public refresh(query?: any) {
    this.movieService.getMovies(query)
      .subscribe((resp: any) => {
        this.movies = resp;
      });
  }

  public create() {
    this.router.navigate(['create']);
  }

  onLogout() {
    this.authService.logout();
  }
}
