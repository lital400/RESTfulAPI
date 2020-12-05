import express from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '..';
import { Category, categoryList } from '../models/category';
import { Post, postList } from '../models/post';
import { PostCategory, postCategoryList } from '../models/postCategory';
import jwt_decode from 'jwt-decode';


const postCategoryRouter = express.Router();

postCategoryRouter.get('/PostCategory/:postID',(req,res,next)=>{       // Returns all the categories related to the given post
    if(postList.some(u => u.postId == +req.params.postID)) 
    {
        let categoryArray: Category[] = [];
        if(postCategoryList.some(u => u.postId == +req.params.postID)) {
            let postCategoryArray = postCategoryList.filter(u => u.postId == +req.params.postID);
            categoryArray = categoryList.filter(function(el) {
                if(postCategoryArray.some(u => u.categoryId == el.categoryId))
                    return el;
            });  
        }
        const returnObj = {"postId": req.params.postID, "categories": categoryArray};
        res.status(200).send(returnObj);
    }
    else
        res.status(404).json({ status: 404, message: 'Post not Found' });
});

postCategoryRouter.get('/PostCategory/Posts/:categoryID',(req,res,next)=>{    // Returns all the posts for a given category
    if(categoryList.some(u => u.categoryId == +req.params.categoryID)) 
    {
        let postArray: Post[] = [];
        if(postCategoryList.some(u => u.categoryId == +req.params.categoryID)) {
            let postCategoryArray = postCategoryList.filter(u => u.categoryId == +req.params.categoryID);
            postArray = postList.filter(function(el) {
                if(postCategoryArray.some(u => u.postId == el.postId))
                    return el;
            });  
        }
        const returnObj = {"categoryId": req.params.categoryID, "posts": postArray};
        res.status(200).send(returnObj);
    }
    else
        res.status(404).json({ status: 404, message: 'Category not Found' });
});


postCategoryRouter.post('/PostCategory/:postID/:categoryID',(req,res,next)=>{ 
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(categoryList.some(u => u.categoryId === +req.params.categoryID)) 
                {
                    if(postList.some(u => u.postId === +req.params.postID))
                    {
                        let postIndex = postList.findIndex(u => u.postId == +req.params.postID);
                        let tokenInfo : any = jwt_decode(token);
                        let user = tokenInfo.UserData.userId;   // get current userId from token

                        if(postList[postIndex].userId == user)
                        {
                            let postCategory = new PostCategory(+req.params.categoryID, +req.params.postID);
                            if(!postCategoryList.some(u => u.categoryId === postCategory.categoryId && u.postId === postCategory.postId))
                            {
                                postCategoryList.push(postCategory);
                                res.status(201).send(postCategoryList);
                            }
                            else 
                                res.status(401).json({ status: 401, message: 'The PostCategory already exists' });
                        }
                        else
                            res.status(401).json({ status: 401, message: 'You are not the author of the post - access denied!' });
                    }
                    else
                        res.status(404).json({ status: 404, message: 'Post not Found' });
                }
                else
                    res.status(404).json({ status: 404, message: 'Category not Found' });
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

postCategoryRouter.delete('/PostCategory/:postID/:categoryID',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret); 
            if(verified) 
            {
                if(categoryList.some(u => u.categoryId === +req.params.categoryID)) 
                {
                    if(postList.some(u => u.postId === +req.params.postID))
                    {
                        let postIndex = postList.findIndex(u => u.postId == +req.params.postID);
                        let tokenInfo : any = jwt_decode(token);
                        let user = tokenInfo.UserData.userId;   // get current userId from token

                        if(postList[postIndex].userId == user)
                        {
                            if(postCategoryList.some(u => u.categoryId === +req.params.categoryID && u.postId === +req.params.postID))
                            {
                                let index = postCategoryList.findIndex(u => u.categoryId === +req.params.categoryID && u.postId === +req.params.postID);
                                postCategoryList.splice(index, 1);
                                res.status(204).send();
                            }
                            else
                                res.status(401).json({ status: 401, message: 'The PostCategory does not exist' });
                        }
                        else
                            res.status(401).json({ status: 401, message: 'You are not the author of the post - access denied!' });
                    }
                    else
                        res.status(404).json({ status: 404, message: 'Post not Found' });
                }
                else
                    res.status(404).json({ status: 404, message: 'Category not Found' });
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


export {postCategoryRouter};