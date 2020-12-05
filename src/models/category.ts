class Category {
    static id: number = 0;
    categoryId: number = 0;
    name: string = "";
    description: string = "";

    constructor(inptName: string, inptDescription: string){
        this.categoryId = Category.id++;
        this.name = inptName;
        this.description = inptDescription;
    }

    get getCategoryId(): number { return this.categoryId; }
    get getName(): string { return this.name; }
    get getDescription(): string { return this.description; }

    set setName(name: string) { this.name = name; }
    set setDescription(description: string) { this.description = description; }
}

var categoryList: Category[] = [];

export {Category, categoryList};

