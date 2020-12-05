"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCategoryList = exports.PostCategory = void 0;
class PostCategory {
    constructor(categoryId, postId) {
        this.categoryId = 0;
        this.postId = 0;
        this.categoryId = categoryId;
        this.postId = postId;
    }
    get getCategoryId() { return this.categoryId; }
    get getPostId() { return this.postId; }
    set setCategoryId(categoryId) { this.categoryId = categoryId; }
    set setPostId(postId) { this.postId = postId; }
}
exports.PostCategory = PostCategory;
var postCategoryList = [];
exports.postCategoryList = postCategoryList;
//# sourceMappingURL=postCategory.js.map