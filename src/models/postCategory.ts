class PostCategory {
    categoryId: number = 0;
    postId: number = 0;

    constructor(categoryId: number, postId: number){
        this.categoryId = categoryId;
        this.postId = postId;
    }

    get getCategoryId(): number { return this.categoryId; }
    get getPostId(): number { return this.postId; }

    set setCategoryId(categoryId: number) { this.categoryId = categoryId; }
    set setPostId(postId: number) { this.postId = postId; }
}

var postCategoryList: PostCategory[] = [];

export {PostCategory, postCategoryList};

