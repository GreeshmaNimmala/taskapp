import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CreateListService } from 'src/app/services/create-list.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  listId:string;
  taskId:string;

  constructor(private route:ActivatedRoute,private listService:CreateListService,private router:Router) {
   }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      console.log(params.listId);
      console.log(params.taskId);
      this.taskId = params.taskId;
      this.listId = params.listId;
    });
  }

  updateTask(title:string){

    this.listService.editTask(this.listId,this.taskId,title).subscribe(()=>{
      this.router.navigate(['/lists',this.listId]);
    })

  }

}
