"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postList = exports.Post = void 0;
class Post {
    constructor(inptTitle, inputContent, inptUserId, inputHeaderImage, inputLastUpdated) {
        this.postId = 0;
        this.createdDate = new Date();
        this.title = "";
        this.content = "";
        this.userId = "";
        this.headerImage = "";
        this.lastUpdated = new Date();
        this.postId = Post.id++;
        this.createdDate = new Date();
        this.title = inptTitle;
        this.content = inputContent;
        this.userId = inptUserId;
        this.headerImage = inputHeaderImage;
        this.lastUpdated = inputLastUpdated;
    }
    get getPostId() { return this.postId; }
    get getCreatedDate() { return this.createdDate; }
    get getTitle() { return this.title; }
    get getContent() { return this.content; }
    get getUserId() { return this.userId; }
    get getHeaderImage() { return this.headerImage; }
    get getLastUpdated() { return this.lastUpdated; }
    set setContent(content) { this.content = content; }
    set setHeaderImage(headerImage) { this.headerImage = headerImage; }
    set setLastUpdated(lastUpdated) { this.lastUpdated = lastUpdated; }
}
exports.Post = Post;
Post.id = 0;
var postList = [];
exports.postList = postList;
//# sourceMappingURL=post.js.map