"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_1 = require("../models/post");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const __1 = require("..");
const user_1 = require("../models/user");
const postCategory_1 = require("../models/postCategory");
const comment_1 = require("../models/comment");
const postRouter = express_1.default.Router();
exports.postRouter = postRouter;
postRouter.get('/Posts/:postID', (req, res, next) => {
    if (post_1.postList.some(u => u.postId == +req.params.postID)) {
        let post = post_1.postList.find(u => u.postId == +req.params.postID);
        res.status(200).send(post);
    }
    else {
        res.status(404).json({ status: 404, message: 'Post not Found' });
    }
});
postRouter.get('/Posts/User/:userId', (req, res, next) => {
    if (user_1.userList.some(u => u.id == req.params.userId)) {
        if (post_1.postList.some(u => u.userId == req.params.userId)) {
            let userPosts = post_1.postList.filter(u => u.userId == req.params.userId);
            let sortedposts = userPosts.sort(function (a, b) {
                if (a.createdDate > b.createdDate)
                    return -1;
                if (a.createdDate < b.createdDate)
                    return 1;
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
postRouter.get('/Posts', (req, res, next) => {
    var postArray = new Array;
    for (var i = post_1.postList.length - 1; i >= 0; i--) { // latest post first 
        postArray.push(post_1.postList[i]);
    }
    res.status(200).send(postArray);
});
postRouter.post('/Posts', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (req.body.title === "" || typeof req.body.title === "undefined") {
                    res.status(406).json({ status: 406, message: 'A title is required. Please enter a post title.' });
                }
                else if (req.body.content === "" || typeof req.body.content === "undefined") {
                    res.status(406).json({ status: 406, message: 'Post content is required. Please enter post content.' });
                }
                else {
                    let tokenInfo = jwt_decode_1.default(token);
                    let user = tokenInfo.UserData.userId; // get userId from token
                    let post = new post_1.Post(req.body.title, req.body.content, user, req.body.headerImage, new Date());
                    post_1.postList.push(post);
                    res.status(201).send(post);
                }
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
postRouter.patch('/Posts/:postID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (post_1.postList.some(u => u.postId == +req.params.postID)) {
                    let index = post_1.postList.findIndex(u => u.postId == +req.params.postID);
                    let tokenInfo = jwt_decode_1.default(token);
                    let user = tokenInfo.UserData.userId; // get current userId from token
                    if (post_1.postList[index].userId == user) {
                        if (req.body.postID && req.body.postID != post_1.postList[index].postId)
                            res.status(400).json({ status: 400, message: 'The post Id cannot be changed.' });
                        else if (req.body.title && req.body.title != post_1.postList[index].title)
                            res.status(400).json({ status: 400, message: 'The post title cannot be changed.' });
                        else if (req.body.createdDate && req.body.createdDate != post_1.postList[index].createdDate)
                            res.status(400).json({ status: 400, message: 'The post created date cannot be changed.' });
                        else if (req.body.lastUpdated && req.body.lastUpdated != post_1.postList[index].lastUpdated)
                            res.status(400).json({ status: 400, message: 'The post last updated date cannot be changed.' });
                        else {
                            if (req.body.content)
                                post_1.postList[index].content = req.body.content;
                            if (req.body.headerImage)
                                post_1.postList[index].headerImage = req.body.headerImage;
                            post_1.postList[index].lastUpdated = new Date;
                            res.status(200).send(post_1.postList[index]); // send updated post back
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
postRouter.delete('/Posts/:postID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (post_1.postList.some(u => u.postId === +req.params.postID)) {
                    let index = post_1.postList.findIndex(u => u.postId == +req.params.postID);
                    let tokenInfo = jwt_decode_1.default(token);
                    let user = tokenInfo.UserData.userId; // get current userId from token
                    if (post_1.postList[index].userId == user) {
                        if (postCategory_1.postCategoryList.some(u => u.postId === +req.params.postID)) // delete related PostCategories
                         {
                            for (let i = postCategory_1.postCategoryList.length - 1; i >= 0; i--) {
                                if (postCategory_1.postCategoryList[i].postId === +req.params.postID) {
                                    postCategory_1.postCategoryList.splice(i, 1);
                                }
                            }
                        }
                        if (comment_1.commentList.some(u => u.postId === +req.params.postID)) // delete related comments
                         {
                            for (let i = comment_1.commentList.length - 1; i >= 0; i--) {
                                if (comment_1.commentList[i].postId === +req.params.postID) {
                                    comment_1.commentList.splice(i, 1);
                                }
                            }
                        }
                        post_1.postList.splice(index, 1);
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
//# sourceMappingURL=posts.js.map