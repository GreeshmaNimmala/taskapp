const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const mongoose=require('./db/mongoose');
const jwt=require('jsonwebtoken');

const cors=require('cors');

//Load models from Mongoose
const List=require('./db/model/list');
const Task=require('./db/model/task');
const User = require('./db/model/user.model');


//Load Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Methods","GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

app.get('/',(req,res)=>{
    res.send("hello from express server");
})


let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}



let authenticate=((req,res,next)=>{
    let token=req.header('x-access-token');

    jwt.verify(token,User.getJWTSecret(),(err,decoded)=>{
        if(err){
            res.status(401).send(err);
        }
        else{
            req.user_id=decoded._id;
            next();
        }
    })

})

app.get('/lists',authenticate,(req,res)=>{

    List.find(
        {_userId:req.user_id}
    ).then((lists)=>{
        res.send(lists);
    })
    .catch((e)=>{
        res.send(e);
    })

});

app.post('/lists',authenticate,(req,res)=>{
    let newList=new List({
        title:req.body.title,
        _userId:req.user_id
    });
    newList.save().then((result)=>{
        res.send(result);
    })

})

app.patch('/lists/:id',authenticate,(req,res)=>{

    List.findOneAndUpdate({_id:req.params.id,_userId:req.user_id},{$set:req.body})
    .then(()=>{
        res.send({
            "message":"updated successfully"
        })
    });

})

app.delete('/lists/:id',authenticate,(req,res)=>{
    List.findOneAndRemove({_id:req.params.id,_userId:req.user_id})
    .then((result)=>{
        res.send(result);
        deleteTasksFromList(result._id);
    })
    .catch((e)=>{
        res.send(e);

    })

})


//GET all tasks of a list

app.get('/lists/:listId/task',authenticate,(req,res)=>{
    Task.find({
        _listId:req.params.listId
    }).then((task)=>{
        res.send(task);
    })
})

//To get one task of a list
// app.get('/lists/:listId/task/:taskId',(req,res)=>{
//     Task.findOne({
//         _id:req.params.taskId,
//         _listId:req.params.listId
//     }).then((result)=>{
//         res.send(result);
//     })

// })


app.post('/lists/:listId/task',authenticate,(req,res)=>{

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })

})

// app.patch('/lists/:listId/task/:taskId',authenticate,(req,res)=>{
//     List.findOne({
//         _id:req.params.listId,
//         _userId:req.user_Id
//     }).then((list)=>{
//         if(list){
//             return true;
//         }
//         return false;
//     }).then((canUpdateTask)=>{
//         if(canUpdateTask){
//              Task.findOneAndUpdate({
//         _listId:req.params.listId,
//         _id:req.params.taskId
//     },{$set:req.body})
//     .then(()=>{
//         res.send(
//             {
//                 message:"Updated Successfully"
//             }
//         )})
//     }
//     })
// });

app.patch('/lists/:listId/task/:taskId', authenticate, (req, res) => {
    // We want to update an existing task (specified by taskId)

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

app.delete('/lists/:listId/task/:taskId',authenticate,(req,res)=>{

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canDeleteTask)=>{
        if(canDeleteTask){

            Task.findOneAndRemove({
                _id:req.params.taskId,
                _listId:req.params.listId
            }).then((result)=>{
                res.send(result);
            })

        }
    })

})

let deleteTasksFromList=((_listId)=>{

    Task.deleteMany({
        _listId
    }).then(()=>{
        console.log("Taks are deleted");
    })
})

app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})




app.listen(3000,()=>{
    console.log("Server is listening");
})