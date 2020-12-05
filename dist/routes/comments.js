"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_1 = require("../models/post");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const __1 = require("..");
const comment_1 = require("../models/comment");
const commentRouter = express_1.default.Router();
exports.commentRouter = commentRouter;
commentRouter.get('/Comments/:postId', (req, res, next) => {
    if (post_1.postList.some(u => u.postId == +req.params.postId)) {
        let commentArray = comment_1.commentList.filter(u => u.postId == +req.params.postId);
        let sortedcomments = commentArray.sort(function (a, b) {
            if (a.commentDate > b.commentDate)
                return -1;
            if (a.commentDate < b.commentDate)
                return 1;
            return 0;
        });
        res.status(200).send(sortedcomments);
    }
    else {
        res.status(404).json({ status: 404, message: 'Post not Found' });
    }
});
commentRouter.get('/Comments/:postID/:commentID', (req, res, next) => {
    if (post_1.postList.some(u => u.postId == +req.params.postID)) {
        if (comment_1.commentList.some(u => u.commentId == +req.params.commentID)) {
            let comment = comment_1.commentList.find(u => u.commentId == +req.params.commentID);
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
commentRouter.post('/Comments/:postId', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (post_1.postList.some(u => u.postId == +req.params.postId)) {
                    if (req.body.comment === "" || typeof req.body.comment === "undefined") {
                        res.status(406).json({ status: 406, message: 'Comment is required.' });
                    }
                    else {
                        let tokenInfo = jwt_decode_1.default(token);
                        let user = tokenInfo.UserData.userId; // get userId from token
                        let comment = new comment_1.Comment(req.body.comment, user, +req.params.postId);
                        comment_1.commentList.push(comment);
                        res.status(201).send(comment);
                    }
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
commentRouter.patch('/Comments/:postID/:commentID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (post_1.postList.some(u => u.postId == +req.params.postID)) {
                    if (comment_1.commentList.some(u => u.commentId == +req.params.commentID)) {
                        let index = comment_1.commentList.findIndex(u => u.commentId == +req.params.commentID);
                        let tokenInfo = jwt_decode_1.default(token);
                        let user = tokenInfo.UserData.userId; // get current userId from token
                        if (comment_1.commentList[index].userId == user) {
                            if (req.body.postID && req.body.postID != comment_1.commentList[index].postId)
                                res.status(400).json({ status: 400, message: 'The post Id cannot be changed.' });
                            else if (req.body.commentID && req.body.commentID != comment_1.commentList[index].commentId)
                                res.status(400).json({ status: 400, message: 'The comment Id cannot be changed.' });
                            else if (req.body.userId && req.body.userId != comment_1.commentList[index].userId)
                                res.status(400).json({ status: 400, message: 'The user Id cannot be changed.' });
                            else if (req.body.commentDate && req.body.commentDate != comment_1.commentList[index].commentDate)
                                res.status(400).json({ status: 400, message: 'The comment date cannot be changed.' });
                            else {
                                if (req.body.comment)
                                    comment_1.commentList[index].comment = req.body.comment;
                                res.status(200).send(comment_1.commentList[index]); // send updated comment back
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
commentRouter.delete('/Comments/:postID/:commentID', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (post_1.postList.some(u => u.postId == +req.params.postID)) {
                    if (comment_1.commentList.some(u => u.commentId == +req.params.commentID)) {
                        let index = comment_1.commentList.findIndex(u => u.commentId == +req.params.commentID);
                        let tokenInfo = jwt_decode_1.default(token);
                        let user = tokenInfo.UserData.userId; // get current userId from token
                        if (comment_1.commentList[index].userId == user) {
                            comment_1.commentList.splice(index, 1);
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
        }
        catch (err) {
            res.status(403).json({ status: 403, message: err });
        }
    }
    else
        res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
});
//# sourceMappingURL=comments.js.map