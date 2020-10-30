const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connected to DB Successfully");
})
.catch((e)=>{
    console.log("Error while connecting to DB",+e);
})

module.exports={
    mongoose
};