"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryList = exports.Category = void 0;
class Category {
    constructor(inptName, inptDescription) {
        this.categoryId = 0;
        this.name = "";
        this.description = "";
        this.categoryId = Category.id++;
        this.name = inptName;
        this.description = inptDescription;
    }
    get getCategoryId() { return this.categoryId; }
    get getName() { return this.name; }
    get getDescription() { return this.description; }
    set setName(name) { this.name = name; }
    set setDescription(description) { this.description = description; }
}
exports.Category = Category;
Category.id = 0;
var categoryList = [];
exports.categoryList = categoryList;
//# sourceMappingURL=category.js.map