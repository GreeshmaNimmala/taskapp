import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CreateListService } from 'src/app/services/create-list.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  listId:string;

  constructor(private route:ActivatedRoute,private listService:CreateListService,private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      console.log(params);
      this.listId=params.listId;
    });
  }

  updateList(title:string){
    this.listService.edit(this.listId,title).subscribe(()=>{
      this.router.navigate(['/lists',this.listId]);
    })
  }

}
