const mongoose=require('mongoose');

const ListSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    _userId:{
        type:mongoose.Types.ObjectId,
        required:true
    }

});

const List=mongoose.model('List',ListSchema);
module.exports=List;