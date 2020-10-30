import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private loginService:LoginService,private router:Router) { }

  ngOnInit() {
  }

  onSignupButtonClicked(email: string, password: string) {
    this.loginService.signup(email, password).subscribe((res: HttpResponse<any>) => {

      console.log(res);

    });
  }

}
