import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {baseURL, listURL, taskURL} from '../config/api';
import { Observable } from 'rxjs';
import { List } from '../model/list.model';

@Injectable({
  providedIn: 'root'
})

export class CreateListService {
  constructor(private http:HttpClient) { }

  getList():Observable<List[]>{
    return this.http.get<List[]>(listURL);
  }

  createList(title:string){
    return this.http.post(listURL,{title});
  }

  delete(id:string){
    return this.http.delete(`${listURL}/${id}`)
  }
  edit(id:string,title:string){
    return this.http.patch(`${listURL}/${id}`,{title})

  }

  editTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.http.patch(`${baseURL}/lists/${listId}/tasks/${taskId}`, { title });
  }

  deleteTask(listId:string,taskId:string){
    return this.http.delete(`${listURL}/${listId}/task/${taskId}`)
  }

  userLogin(email:string,password:string){
    return this.http.post(`${baseURL}/users/login`,{
      email,
      password
    },{observe:'response'})
}

userSignup(email:string,password:string){
  return this.http.post(`${baseURL}/users`,{
    email,
    password
  },{observe:'response'})
}

}
