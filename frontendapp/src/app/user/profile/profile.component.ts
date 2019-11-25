import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string;
  email: string;

  constructor(private authService: AuthenticationService) { }

  async ngOnInit() {
    if (await this.authService.isLoggedIn) {
      this.name = this.authService.currentUser.name;
      this.email = this.authService.currentUser.email;
    }
  }
}
