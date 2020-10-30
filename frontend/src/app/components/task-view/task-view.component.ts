import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/model/list.model';
import { Task } from 'src/app/model/task.model';
import { CreateListService } from 'src/app/services/create-list.service';
import { TaskServiceService } from 'src/app/services/task-service.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  list:List[];
  tasks:Task[];

  selectedListId:string;

  constructor(private listService:CreateListService,private taskService:TaskServiceService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(){
    this.getList();
    this.route.params.subscribe((params:Params)=>{
      console.log(params);
      if(params.listId){
        this.selectedListId=params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks:Task[])=>{
          this.tasks=tasks;
        })
      }
      else{
        this.tasks=undefined;
      }

    });
    // this.getAllTasks();
  }

  getList(){
    this.listService.getList().subscribe((response:any)=>{
      // console.log(response);
      this.list=response;
    });
  }

  taskComplete(task:Task){
    this.taskService.complete(task).subscribe(()=>{
      console.log("Task Completed Successfully");
      task.completed=!task.completed
    })
  }

  // getAllTasks(listId:string){
  //   this.taskService.getTasks(listId).subscribe((tasks:any[])=>{
  //     console.log(tasks);
  //   })
  // }


  deleteList(){
    this.listService.delete(this.selectedListId).subscribe((res:any)=>{
      this.router.navigate(['/lists']);
      console.log(res);
    })

  }

  onTaskDelete(id:string){
    this.listService.deleteTask(this.selectedListId,id).subscribe((res)=>{
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

}
