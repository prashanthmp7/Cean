import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from 'src/app/services/movie.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  public users: any;
  constructor(private router: Router,
              private movieService: MovieService,
              private location: Location,
              private authService: AuthenticationService) {
    this.users = [];
  }

  ngOnInit() {
    this.location.subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  public refresh(query?: any) {
    this.movieService.getUsers(query)
      .subscribe((resp: any) => {
        this.users = resp;
      });
  }

  public create() {
    this.router.navigate(['create']);
  }

  onLogout() {
    this.authService.logout();
  }

}
