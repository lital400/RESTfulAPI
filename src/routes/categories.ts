import express from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '..';
import { Category, categoryList } from '../models/category';
import { postCategoryList } from '../models/postCategory';

const categoryRouter = express.Router();

categoryRouter.get('/Categories/:categoryId',(req,res,next)=>{
    if(categoryList.some(u => u.categoryId == +req.params.categoryId)) {
        let category = categoryList.find(u => u.categoryId == +req.params.categoryId);
        res.status(200).send(category);
    }
    else {
        res.status(404).json({ status: 404, message: 'Category not Found' });
    }
});

categoryRouter.get('/Categories',(req,res,next)=>{
    categoryList.sort(function(a, b) {
        return a.name.localeCompare(b.name);   // sort categories alphabethically
     });
    res.status(200).send(categoryList);
});

categoryRouter.post('/Categories',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret);
            if(verified)
            {
                if(req.body.categoryName === "" || typeof req.body.categoryName === "undefined") {
                    res.status(406).json({ status: 406, message: 'Category name is required' });
                }
                else if(req.body.categoryDescription === "" || typeof req.body.categoryDescription === "undefined") {
                    res.status(406).json({ status: 406, message: 'Category description is required' });
                }
                else {
                    if(categoryList.some(u => u.name == req.body.categoryName)) {
                        res.status(409).json({ status: 409, message: 'Duplicate Category Name' });
                    }
                    else {
                        let category = new Category(req.body.categoryName, req.body.categoryDescription);
                        categoryList.push(category);
                        res.status(201).send(category);
                    }
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

categoryRouter.patch('/Categories/:categoryId',(req,res,next)=>{

    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret);
            if(verified)
            {
                if(categoryList.some(u => u.categoryId == +req.params.categoryId))
                {
                    let index = categoryList.findIndex(u => u.categoryId == +req.params.categoryId);

                    if(req.body.categoryName)
                    {
                        if(categoryList.some(u => u.name == req.body.categoryName)) {
                            res.status(409).json({ status: 409, message: 'Duplicate Category Name' });
                        }
                        categoryList[index].name = req.body.categoryName;
                    }
                    if(req.body.categoryDescription)
                        categoryList[index].description = req.body.categoryDescription;

                    res.status(200).send(categoryList[index]);  // send updated category back
                }
                else {
                    res.status(404).json({ status: 404, message: 'Category not Found' });
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

categoryRouter.delete('/Categories/:categoryId',(req,res,next)=>{
    let authHeader = req.headers.authorization;  // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jwt.verify(token, secret);
            if(verified)
            {
                if(categoryList.some(u => u.categoryId === +req.params.categoryId))
                {
                    if(postCategoryList.some(u => u.categoryId === +req.params.categoryId))  // delete related PostCategories
                    {
                        for (let i = postCategoryList.length - 1; i >= 0; i--) { 
                            if (postCategoryList[i].categoryId === +req.params.categoryId) {
                                postCategoryList.splice(i, 1); 
                            }
                        }
                    }
                    let index = categoryList.findIndex(u => u.categoryId == +req.params.categoryId); 
                    categoryList.splice(index, 1);  // delete category
                    res.status(204).send();
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


export {categoryRouter};