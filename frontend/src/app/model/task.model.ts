export class Task{
    _id:String
    title:String;
    _listId:String;
    completed:Boolean
    constructor(Id:String,title:String,listId:String,completed:Boolean){
        this._id=Id;
        this.title=title;
        this._listId=listId;
        this.completed=completed
    }
}