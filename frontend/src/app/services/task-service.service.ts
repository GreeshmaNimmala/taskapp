import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL, listURL, taskURL } from '../config/api';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private http:HttpClient) { }

  createTask(title:string,Id:string){
    let taskURL=`${baseURL}/lists/${Id}/task`;
    return this.http.post(taskURL,{title});
    // return this.http.post(listURL+`/${Id}/task`,{title})
  }

  getTasks(id:string):Observable<Task[]>{
    let taskURL=`${baseURL}/lists/${id}/task`;
    return this.http.get<Task[]>(taskURL);
  }

  complete(task:Task){
    let taskURL=`${baseURL}/lists/${task._listId}/task/${task._id}`;
    return this.http.patch(taskURL,{
      completed:!task.completed
    });
  }

  // complete(id:string,taskId:string,title:string){

  //   let taskURL=`${baseURL}/lists/${id}/task/${taskId}`;
  //   return this.http.patch(taskURL,{title})
  // }

}



  // getTasks(_listId:string){
  //   return this.http.get(listURL+`/$(_listId)/task`);
  // }

