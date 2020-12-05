"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentList = exports.Comment = void 0;
class Comment {
    constructor(inptComment, inptUserId, inputPostId) {
        this.commentId = 0;
        this.comment = "";
        this.userId = "";
        this.postId = 0;
        this.commentDate = new Date();
        this.commentId = Comment.id++;
        this.comment = inptComment;
        this.userId = inptUserId;
        this.postId = inputPostId;
        this.commentDate = new Date();
    }
    get getCommentId() { return this.commentId; }
    get getComment() { return this.comment; }
    get getUserId() { return this.userId; }
    get getPostId() { return this.postId; }
    get getCommentDate() { return this.commentDate; }
    set setContent(comment) { this.comment = comment; }
}
exports.Comment = Comment;
Comment.id = 0;
var commentList = [];
exports.commentList = commentList;
//# sourceMappingURL=comment.js.map