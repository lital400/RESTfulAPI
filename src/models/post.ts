class Post {
    static id: number = 0;
    postId: number = 0;
    createdDate: Date = new Date();
    title: string = "";
    content: string = "";
    userId: string = "";
    headerImage: string = "";
    lastUpdated: Date = new Date();

    constructor(inptTitle: string, inputContent: string, inptUserId: string, inputHeaderImage: string, inputLastUpdated: Date){
        this.postId = Post.id++;
        this.createdDate = new Date();
        this.title = inptTitle;
        this.content = inputContent;
        this.userId = inptUserId;
        this.headerImage = inputHeaderImage;
        this.lastUpdated = inputLastUpdated;
    }

    get getPostId(): number { return this.postId; }
    get getCreatedDate(): Date { return this.createdDate; }
    get getTitle(): string { return this.title; }
    get getContent(): string { return this.content; }
    get getUserId(): string { return this.userId; }
    get getHeaderImage(): string { return this.headerImage; }
    get getLastUpdated(): Date { return this.lastUpdated; }

    set setContent(content: string) { this.content = content; }
    set setHeaderImage(headerImage: string) { this.headerImage = headerImage; }
    set setLastUpdated(lastUpdated: Date) { this.lastUpdated = lastUpdated; }
}

var postList: Post[] = [];

export {Post, postList};

