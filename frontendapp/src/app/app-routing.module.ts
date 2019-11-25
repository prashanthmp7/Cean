import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { UserRegistrationComponent } from './user/user-registration/user-registration.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuard } from './helpers/auth.guard';
import { UserlistComponent } from './user/userlist/userlist.component';


const routes: Routes = [
  { path: '', component: UserRegistrationComponent },
  { path: 'movies', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserlistComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateMovieComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
