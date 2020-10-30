import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import {shareReplay,tap} from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginService:LoginService,private router:Router) { }

  ngOnInit(){
  }

  onLoginButtonClicked(email: string, password: string) {
    this.loginService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if(res.status==200){

        this.router.navigate(['/lists']);

    }
      console.log(res);
    });
  }

}
