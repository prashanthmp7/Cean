import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  public formSubmitAttempt: boolean;
  error: string;
  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  // convenience getter for easy access to form fields
  get formObj() {
    return this.form.controls;
  }


  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      try {
        await this.authService.login(this.form.value);
        if (this.authService.errors.status === 401) {
          this.error = 'Login failed.Invalid credentials';
        }
      } catch (err ) {
        this.error = err.message;
        this.loginInvalid = true;
      }
    }
  }
}
