import express from 'express';
import jwt from 'jsonwebtoken';
import { postList } from '../models/post';
import jwt_decode from 'jwt-decode';
import { secret } from '..';
import { Comment, commentList } from '../models/comment';

const commentRouter = express.Router();

commentRouter.get('/Comments/:postId',(req,res,next)=>{
    if(postList.some(u => u.postId == +req.params.postId)) {
        let commentArray = commentList.filter(u => u.postId == +req.params.postId); 
        let sortedcomments = commentArray.sort(function (a, b) {   //  chronological order with most recent comment first
            if (a.commentDate > b.commentDate) return -1;
            if (a.commentDate < b.commentDate) return 1;
            return 0;
          });
        res.status(200).send(sortedcomments); 
    }
    else {
        res.status(404).json({ status: 404, message: 'Post not Found' });
    }
}); 

commentRouter.get('/Comments/:postID/:commentID',(req,res,next)=>{
    if(postList.some(u => u.postId == +req.params.postID)) 
    {
        if(commentList.some(u => u.commentId == +req.params.commentID)) 
        {
            let comment = commentList.find(u => u.commentId == +req.params.commentID);
            res.status(200).send(comment); 
        }
        else {
            res.status(404).json({ status: 404, message: 'Comment not Found' });
        }
    }
    else {
        res.status(404).json({ status: 404, message: 'Post not Found' });
    }
}); 

commentRouter.post('/Comments/:postId',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified)
            {
                if(postList.some(u => u.postId == +req.params.postId)) 
                {
                    if(req.body.comment === "" || typeof req.body.comment === "undefined") {
                        res.status(406).json({ status: 406, message: 'Comment is required.' }); 
                    }
                    else {
                        let tokenInfo : any = jwt_decode(token);
                        let user = tokenInfo.UserData.userId;    // get userId from token
                        let comment = new Comment(req.body.comment, user, +req.params.postId);
                        commentList.push(comment);
                        res.status(201).send(comment);  
                    } 
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

commentRouter.patch('/Comments/:postID/:commentID',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(postList.some(u => u.postId == +req.params.postID)) 
                {
                    if(commentList.some(u => u.commentId == +req.params.commentID)) 
                    {
                        let index = commentList.findIndex(u => u.commentId == +req.params.commentID);
                        let tokenInfo : any = jwt_decode(token);
                        let user = tokenInfo.UserData.userId;  // get current userId from token

                        if(commentList[index].userId == user)
                        {
                            if(req.body.postID && req.body.postID != commentList[index].postId)
                                res.status(400).json({ status: 400, message: 'The post Id cannot be changed.' });  
                            else if(req.body.commentID && req.body.commentID != commentList[index].commentId)
                                res.status(400).json({ status: 400, message: 'The comment Id cannot be changed.' }); 
                            else if(req.body.userId && req.body.userId != commentList[index].userId)
                                res.status(400).json({ status: 400, message: 'The user Id cannot be changed.' }); 
                            else if(req.body.commentDate && req.body.commentDate != commentList[index].commentDate)
                                res.status(400).json({ status: 400, message: 'The comment date cannot be changed.' }); 
                            else
                            {
                                if (req.body.comment)
                                    commentList[index].comment = req.body.comment;
                                res.status(200).send(commentList[index]);      // send updated comment back
                            }
                        }
                        else
                            res.status(401).json({ status: 401, message: 'Cannot edit comments of other users' });
                    }
                    else {
                        res.status(404).json({ status: 404, message: 'Comment not Found' });
                    }
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

commentRouter.delete('/Comments/:postID/:commentID',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(postList.some(u => u.postId == +req.params.postID)) 
                {
                    if(commentList.some(u => u.commentId == +req.params.commentID)) 
                    {
                        let index = commentList.findIndex(u => u.commentId == +req.params.commentID);
                        let tokenInfo : any = jwt_decode(token);
                        let user = tokenInfo.UserData.userId;  // get current userId from token

                        if(commentList[index].userId == user)
                        {
                            commentList.splice(index, 1);
                            res.status(204).send();
                            
                        }
                        else
                            res.status(401).json({ status: 401, message: 'Cannot delete comments of other users' });
                    }
                    else {
                        res.status(404).json({ status: 404, message: 'Comment not Found' });
                    }
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


export {commentRouter};