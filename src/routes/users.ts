import express from 'express';
import { User, userList } from '../models/user';
import jwt from 'jsonwebtoken';
import emailValidator from 'email-validator';
import { postList } from '../models/post';
import { secret } from '..';

const userRouter = express.Router();

userRouter.get('/Users/:userId',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(userList.some(u => u.id == req.params.userId)) {
                    let user = userList.map(({ password, ...thisUser }) => thisUser).find(u => u.userId == req.params.userId);  // exclude password from output 
                    res.status(200).send(user);
                }
                else {
                    res.status(404).json({ status: 404, message: `The user Id ${req.params.userId} could not be found.` });
                }
            }
            else
                res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
        } catch(err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
}); 


userRouter.get('/Users/Posts/:userId',(req,res,next)=> {    // Returns all posts for the passed in user
    if(userList.some(u => u.id == req.params.userId)) 
    {
        if(postList.some(u => u.userId == req.params.userId)) {
            let userPosts = postList.filter(u => u.userId == req.params.userId);
            let sortedposts = userPosts.sort(function (a, b) {    // sorted chronologically with most recent post first for the given user
                if (a.createdDate > b.createdDate) return -1;
                if (a.createdDate < b.createdDate) return 1;
                return 0;
              });
            res.status(200).send(sortedposts); 
        }
        else {
            res.status(404).json({ status: 404, message: 'No posts found for this user' });
        }
    }
    else {
        res.status(404).json({ status: 404, message: 'Invalid user' });
    }
}); 

userRouter.get('/Users/:userId/:password', async (req,res,next)=>{      // login 
    let user = userList.find(u => u.id == req.params.userId);
    if(user) {
        let validPassword = await user.ValidatePassword(req.params.password);
        if(validPassword)
        {
            const {password, ...thisUser} = user; // exclude password
            let token = jwt.sign({UserData:thisUser}, secret, {expiresIn:9000});
            res.status(200).json({token: token});
        }
        else {
            res.status(401).send({ status: 401, message: 'Invalid Username or Password' });
        }
    }
    else {
        res.status(404).json({ status: 404, message: `The user Id ${req.params.userId} could not be found.` });
    }
}); 

userRouter.get('/Users',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
                res.status(200).send(userList.map(({ password, ...users }) => users));  // exclude passwords from output 
            else
                res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
        } catch(err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });    
}); 

userRouter.post('/Users',(req,res,next)=>{
    if(userList.some(u => u.id == req.body.userId)) {
        res.status(409).json({ status: 409, message: 'Duplicate User Id' });
    }
    else if(req.body.userId === "" || typeof req.body.userId === "undefined") {
        res.status(400).json({ status: 400, message: 'A user Id is required. Please enter user Id.' }); 
    }
    else if(req.body.firstName === "" || typeof req.body.firstName === "undefined") {
        res.status(400).json({ status: 400, message: 'First name is required. Please enter first name.' }); 
    }
    else if(req.body.lastName === "" || typeof req.body.lastName === "undefined") {
        res.status(400).json({ status: 400, message: 'Last name is required. Please enter last name.' }); 
    }
    else if(req.body.emailAddress === "" || typeof req.body.emailAddress === "undefined") {
        res.status(400).json({ status: 400, message: 'Email is required. Please enter an email address.' }); 
    }
    else if(req.body.password === "" || typeof req.body.password === "undefined") {
        res.status(400).json({ status: 400, message: 'Password is required. Please enter a password.' }); 
    }
    else {
        if(emailValidator.validate(req.body.emailAddress))
        {
            let user = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
            user.HashPassword(req.body.password);
            userList.push(user);
            const {password, ...secureUser} = user;  // exclude the password from output
            res.status(201).send(secureUser);
        }
        else
            res.status(406).json({ status: 406, message: 'Invalid email address' });
    } 
}); 

userRouter.patch('/Users/:userId',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(userList.some(u => u.id == req.params.userId)) {
                    let index = userList.findIndex(u => u.id == req.params.userId);
            
                    if(req.body.userId && req.body.userId != userList[index].id)
                        res.status(400).json({ status: 400, message: 'The user Id cannot be changed.' });  
                    else
                    {
                        if (req.body.firstName)
                            userList[index].firstName = req.body.firstName;
                        if (req.body.lastName)
                            userList[index].lastName = req.body.lastName;
                        if (req.body.emailAddress)
                        {
                            if(emailValidator.validate(req.body.emailAddress))
                                userList[index].emailAddress = req.body.emailAddress;
                            else
                                res.status(406).json({ status: 406, message: 'Invalid email address' });
                        }
                        if (req.body.password)
                            userList[index].HashPassword(req.body.password);
                    
                        const {password, ...secureUser} = userList[index];  // exclude the password from output
                        res.status(200).send(secureUser); 
                    }
                }
                else {
                    res.status(404).json({ status: 404, message: `The user Id ${req.params.userId} could not be found.` });
                }
            } 
            else
                res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
        } catch(err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
}); 

userRouter.delete('/Users/:userId',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(userList.some(u => u.userId === req.params.userId)) 
                {
                    if(postList.some(u => u.userId === req.params.userId))  
                    {
                        for (let i = postList.length - 1; i >= 0; i--) {      // delete user's related posts
                            if (postList[i].userId === req.params.userId) {
                                postList.splice(i, 1); 
                            }
                          }
                    }
                    let index = userList.findIndex(u => u.id == req.params.userId);
                    userList.splice(index, 1);
                    res.status(204).send();
                }
                else {
                    res.status(404).json({ status: 404, message: `The user Id ${req.params.userId} could not be found.` });
                }
            } 
            else
                res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
        } catch(err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
}); 


export {userRouter};