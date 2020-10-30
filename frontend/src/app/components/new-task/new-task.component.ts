import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Task } from 'src/app/model/task.model';
import { TaskServiceService } from 'src/app/services/task-service.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  listId:string;

  constructor(private taskService:TaskServiceService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(){
    this.route.params.subscribe((params:Params)=>{
     this.listId=params['listId'];
     console.log(this.listId);
    });
  }

  newTask(title:string){
    this.taskService.createTask(title,this.listId).subscribe((task:Task)=>{
      console.log(task);
      this.router.navigate(['../'],{relativeTo:this.route})
    })
  }

}
