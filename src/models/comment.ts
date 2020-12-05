class Comment {
    static id: number = 0;
    commentId: number = 0;
    comment: string = "";
    userId: string = "";
    postId: number = 0;
    commentDate: Date = new Date();

    constructor(inptComment: string, inptUserId: string, inputPostId: number){
        this.commentId = Comment.id++;
        this.comment = inptComment;
        this.userId = inptUserId;
        this.postId = inputPostId;
        this.commentDate = new Date();
    }

    get getCommentId(): number { return this.commentId; }
    get getComment(): string { return this.comment; }
    get getUserId(): string { return this.userId; }
    get getPostId(): number { return this.postId; }
    get getCommentDate(): Date { return this.commentDate; }

    set setContent(comment: string) { this.comment = comment; }
}

var commentList: Comment[] = [];

export {Comment, commentList};

