import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';
import { User } from '../user/models/user';

@Injectable()
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public currentUser: User;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private server: LoginService) {
    console.log('AuthenticationService');
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('Logged in from memory');
      const user = JSON.parse(userData);
      this.currentUser = user;
      this.currentUser.token = user.token;
      this.server.setLoggedIn(true, this.currentUser.token);
      this.loggedIn.next(true);
    }
  }

  login(user) {
    if (user.email !== '' && user.password !== '') {
      return this.server.request('POST', '/login', {
        email: user.email,
        password: user.password
      }).subscribe((response: any) => {
        if (response.auth === true && response.token !== undefined) {
          this.currentUser = response.user;
          this.currentUser.token = response.token;
          this.server.setLoggedIn(true, this.currentUser.token);
          this.loggedIn.next(true);
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          this.router.navigateByUrl('/profile');
        }
      });
    }
  }

  logout() {
    this.server.setLoggedIn(false);
    delete this.currentUser.token;

    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
