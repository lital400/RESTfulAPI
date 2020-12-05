"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCategoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const category_1 = require("../models/category");
const post_1 = require("../models/post");
const postCategory_1 = require("../models/postCategory");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const postCategoryRouter = express_1.default.Router();
exports.postCategoryRouter = postCategoryRouter;
postCategoryRouter.get('/PostCategory/:postID', (req, res, next) => {
    if (post_1.postList.some(u => u.postId == +req.params.postID)) {
        let categoryArray = [];
        if (postCategory_1.postCategoryList.some(u => u.postId == +req.params.postID)) {
            let postCategoryArray = postCategory_1.postCategoryList.filter(u => u.postId == +req.params.postID);
            categoryArray = category_1.categoryList.filter(function (el) {
                if (postCategoryArray.some(u => u.categoryId == el.categoryId))
                    return el;
            });
        }
        const returnObj = { "postId": req.params.postID, "categories": categoryArray };
        res.status(200).send(returnObj);
    }
    else
        res.status(404).json({ status: 404, message: 'Post not Found' });
});
postCategoryRouter.get('/PostCategory/Posts/:categoryID', (req, res, next) => {
    if (category_1.categoryList.some(u => u.categoryId == +req.params.categoryID)) {
        let postArray = [];
        if (postCategory_1.postCategoryList.some(u => u.categoryId == +req.params.categoryID)) {
            let postCategoryArray = postCategory_1.postCategoryList.filter(u => u.categoryId == +req.params.categoryID);
            postArray = post_1.postList.filter(function (el) {
                if (postCategoryArray.some(u => u.postId == el.postId))
                    return el;
            });
        }
        const returnObj = { "categoryId": req.params.categoryID, "posts": postArray };
        res.status(200).send(returnObj);
    }
    else
        res.status(404).json({ status: 404, message: 'Category not Found' });
});
postCategoryRouter.post('/PostCategory/:postID/:categoryID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (category_1.categoryList.some(u => u.categoryId === +req.params.categoryID)) {
                    if (post_1.postList.some(u => u.postId === +req.params.postID)) {
                        let postIndex = post_1.postList.findIndex(u => u.postId == +req.params.postID);
                        let tokenInfo = jwt_decode_1.default(token);
                        let user = tokenInfo.UserData.userId; // get current userId from token
                        if (post_1.postList[postIndex].userId == user) {
                            let postCategory = new postCategory_1.PostCategory(+req.params.categoryID, +req.params.postID);
                            if (!postCategory_1.postCategoryList.some(u => u.categoryId === postCategory.categoryId && u.postId === postCategory.postId)) {
                                postCategory_1.postCategoryList.push(postCategory);
                                res.status(201).send(postCategory_1.postCategoryList);
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
postCategoryRouter.delete('/PostCategory/:postID/:categoryID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (category_1.categoryList.some(u => u.categoryId === +req.params.categoryID)) {
                    if (post_1.postList.some(u => u.postId === +req.params.postID)) {
                        let postIndex = post_1.postList.findIndex(u => u.postId == +req.params.postID);
                        let tokenInfo = jwt_decode_1.default(token);
                        let user = tokenInfo.UserData.userId; // get current userId from token
                        if (post_1.postList[postIndex].userId == user) {
                            if (postCategory_1.postCategoryList.some(u => u.categoryId === +req.params.categoryID && u.postId === +req.params.postID)) {
                                let index = postCategory_1.postCategoryList.findIndex(u => u.categoryId === +req.params.categoryID && u.postId === +req.params.postID);
                                postCategory_1.postCategoryList.splice(index, 1);
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
//# sourceMappingURL=postcategories.js.map