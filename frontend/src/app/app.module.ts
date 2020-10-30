import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewListComponent } from './components/new-list/new-list.component';
import { FormsModule } from '@angular/forms';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { LoginComponent } from './components/login/login.component';
import { WebReqInterceptorService } from './services/web-req-interceptor.service';
import { SignupComponent } from './components/signup/signup.component';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginComponent,
    SignupComponent,
    EditListComponent,
    EditTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:WebReqInterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
