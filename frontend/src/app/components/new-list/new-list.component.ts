import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { List } from 'src/app/model/list.model';
import { CreateListService } from 'src/app/services/create-list.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskService:CreateListService, private router:Router) { }

  ngOnInit(): void {
  }

  newList(title:string){
    this.taskService.createList(title).subscribe((response:List)=>{
      console.log(response);
      //Have to display the created list in the root directory with lists/id
      this.router.navigate(['/lists',response._id])

     });


  }

}
