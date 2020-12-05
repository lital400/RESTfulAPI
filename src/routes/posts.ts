import express from 'express';
import jwt from 'jsonwebtoken';
import { Post, postList } from '../models/post';
import jwt_decode from 'jwt-decode';
import { secret } from '..';
import { userList } from '../models/user';
import { postCategoryList } from '../models/postCategory';
import { commentList } from '../models/comment';

const postRouter = express.Router();

postRouter.get('/Posts/:postID',(req,res,next)=>{
    if(postList.some(u => u.postId == +req.params.postID)) {
        let post = postList.find(u => u.postId == +req.params.postID); 
        res.status(200).send(post);
    }
    else {
        res.status(404).json({ status: 404, message: 'Post not Found' });
    }
}); 

postRouter.get('/Posts/User/:userId',(req,res,next)=> {      // Returns a list of all the posts that belong to the selected user
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


postRouter.get('/Posts',(req,res,next)=>{
    var postArray = new Array;
    for(var i = postList.length - 1; i >= 0; i--) {   // latest post first 
        postArray.push(postList[i]);
    }
    res.status(200).send(postArray); 
}); 

postRouter.post('/Posts',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified)
            {
                if(req.body.title === "" || typeof req.body.title === "undefined") {
                    res.status(406).json({ status: 406, message: 'A title is required. Please enter a post title.' }); 
                }
                else if(req.body.content === "" || typeof req.body.content === "undefined") {
                    res.status(406).json({ status: 406, message: 'Post content is required. Please enter post content.' }); 
                }
                else {
                    let tokenInfo : any = jwt_decode(token);
                    let user = tokenInfo.UserData.userId;  // get userId from token
                    let post = new Post(req.body.title, req.body.content, user, req.body.headerImage, new Date());
                    postList.push(post);
                    res.status(201).send(post);  
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

postRouter.patch('/Posts/:postID',(req,res,next)=>{
    
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(postList.some(u => u.postId == +req.params.postID)) 
                {
                    let index = postList.findIndex(u => u.postId == +req.params.postID);
                    let tokenInfo : any = jwt_decode(token);
                    let user = tokenInfo.UserData.userId;  // get current userId from token

                    if(postList[index].userId == user)
                    {
                        if(req.body.postID && req.body.postID != postList[index].postId)
                            res.status(400).json({ status: 400, message: 'The post Id cannot be changed.' });  
                        else if(req.body.title && req.body.title != postList[index].title)
                            res.status(400).json({ status: 400, message: 'The post title cannot be changed.' }); 
                        else if(req.body.createdDate && req.body.createdDate != postList[index].createdDate)
                            res.status(400).json({ status: 400, message: 'The post created date cannot be changed.' }); 
                        else if(req.body.lastUpdated && req.body.lastUpdated != postList[index].lastUpdated)
                            res.status(400).json({ status: 400, message: 'The post last updated date cannot be changed.' }); 
                        else
                        {
                            if (req.body.content)
                                postList[index].content = req.body.content;
                            if (req.body.headerImage)
                                postList[index].headerImage = req.body.headerImage;
                            
                            postList[index].lastUpdated = new Date;
                            res.status(200).send(postList[index]);  // send updated post back
                        }
                    }
                    else
                        res.status(401).json({ status: 401, message: 'Cannot edit posts of other users' });
                }
                else {
                    res.status(404).json({ status: 404, message: 'Post not Found' });
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

postRouter.delete('/Posts/:postID',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(postList.some(u => u.postId === +req.params.postID)) 
                {
                    let index = postList.findIndex(u => u.postId == +req.params.postID);
                    let tokenInfo : any = jwt_decode(token);
                    let user = tokenInfo.UserData.userId;  // get current userId from token

                    if(postList[index].userId == user)
                    {
                        if(postCategoryList.some(u => u.postId === +req.params.postID))  // delete related PostCategories
                        {
                            for (let i = postCategoryList.length - 1; i >= 0; i--) { 
                                if (postCategoryList[i].postId === +req.params.postID) {
                                    postCategoryList.splice(i, 1); 
                                }
                            }
                        }
                        if(commentList.some(u => u.postId === +req.params.postID))  // delete related comments
                        {
                            for (let i = commentList.length - 1; i >= 0; i--) { 
                                if (commentList[i].postId === +req.params.postID) {
                                    commentList.splice(i, 1); 
                                }
                            }
                        }
                        postList.splice(index, 1);
                        res.status(204).send();
                    }
                    else
                        res.status(401).json({ status: 401, message: 'Cannot delete posts of other users' });
                }
                else
                    res.status(404).json({ status: 404, message: 'Post not Found' });
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


export {postRouter};