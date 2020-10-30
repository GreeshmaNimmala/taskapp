import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { baseURL } from '../config/api';
import { CreateListService } from './create-list.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient,private webService:CreateListService,private router:Router) { }

  signup(email: string, password: string) {
    return this.webService.userSignup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log("Successfully signed Up");
      })
    )
  }

  login(email: string, password: string) {
    return this.webService.userLogin(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log("LOGGED IN!");
      })
    )
  }

  private setSession(userId:string,accessToken:string,refreshToken:string){
    localStorage.setItem('user-id',userId);
    localStorage.setItem('x-access-token',accessToken);
    localStorage.setItem('x-refresh-token',refreshToken)
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  onLogout(){
    this.removeSession();

    this.router.navigate(['/login'])


  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }
  setAccessToken(accessToken:string){
    localStorage.setItem('x-access-token',accessToken);
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }

  getUserId(){
    return localStorage.getItem('user-id');
  }

  getNewAccessToken(){
    return this.http.get(`${baseURL}/users/me/access-token`,{

      headers:{
        'x-refresh-token':this.getRefreshToken(),
        '_id':this.getUserId()
      },
      observe:'response'
    }).pipe(tap((res:HttpResponse<any>)=>{
      this.setAccessToken(res.headers.get('x-access-token'))

    }))
  }


}
