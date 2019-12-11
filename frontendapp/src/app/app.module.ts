import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieService } from './services/movie.service';
import { UserRegistrationComponent } from './user/user-registration/user-registration.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LoginService } from './services/login.service';
import { AuthenticationService } from './services/authentication.service';
import { UserlistComponent } from './user/userlist/userlist.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateMovieComponent,
    MovieListComponent,
    UserRegistrationComponent,
    LoginComponent,
    ProfileComponent,
    UserlistComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ MovieService, LoginService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
