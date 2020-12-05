"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const category_1 = require("../models/category");
const postCategory_1 = require("../models/postCategory");
const categoryRouter = express_1.default.Router();
exports.categoryRouter = categoryRouter;
categoryRouter.get('/Categories/:categoryId', (req, res, next) => {
    if (category_1.categoryList.some(u => u.categoryId == +req.params.categoryId)) {
        let category = category_1.categoryList.find(u => u.categoryId == +req.params.categoryId);
        res.status(200).send(category);
    }
    else {
        res.status(404).json({ status: 404, message: 'Category not Found' });
    }
});
categoryRouter.get('/Categories', (req, res, next) => {
    category_1.categoryList.sort(function (a, b) {
        return a.name.localeCompare(b.name); // sort categories alphabethically
    });
    res.status(200).send(category_1.categoryList);
});
categoryRouter.post('/Categories', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (req.body.categoryName === "" || typeof req.body.categoryName === "undefined") {
                    res.status(406).json({ status: 406, message: 'Category name is required' });
                }
                else if (req.body.categoryDescription === "" || typeof req.body.categoryDescription === "undefined") {
                    res.status(406).json({ status: 406, message: 'Category description is required' });
                }
                else {
                    if (category_1.categoryList.some(u => u.name == req.body.categoryName)) {
                        res.status(409).json({ status: 409, message: 'Duplicate Category Name' });
                    }
                    else {
                        let category = new category_1.Category(req.body.categoryName, req.body.categoryDescription);
                        category_1.categoryList.push(category);
                        res.status(201).send(category);
                    }
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
categoryRouter.patch('/Categories/:categoryId', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (category_1.categoryList.some(u => u.categoryId == +req.params.categoryId)) {
                    let index = category_1.categoryList.findIndex(u => u.categoryId == +req.params.categoryId);
                    if (req.body.categoryName) {
                        if (category_1.categoryList.some(u => u.name == req.body.categoryName)) {
                            res.status(409).json({ status: 409, message: 'Duplicate Category Name' });
                        }
                        category_1.categoryList[index].name = req.body.categoryName;
                    }
                    if (req.body.categoryDescription)
                        category_1.categoryList[index].description = req.body.categoryDescription;
                    res.status(200).send(category_1.categoryList[index]); // send updated category back
                }
                else {
                    res.status(404).json({ status: 404, message: 'Category not Found' });
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
categoryRouter.delete('/Categories/:categoryId', (req, res, next) => {
    let authHeader = req.headers.authorization; // validate user first
    if (authHeader) {
        try {
            let token = authHeader.split(' ')[1];
            let verified = jsonwebtoken_1.default.verify(token, __1.secret);
            if (verified) {
                if (category_1.categoryList.some(u => u.categoryId === +req.params.categoryId)) {
                    if (postCategory_1.postCategoryList.some(u => u.categoryId === +req.params.categoryId)) // delete related PostCategories
                     {
                        for (let i = postCategory_1.postCategoryList.length - 1; i >= 0; i--) {
                            if (postCategory_1.postCategoryList[i].categoryId === +req.params.categoryId) {
                                postCategory_1.postCategoryList.splice(i, 1);
                            }
                        }
                    }
                    let index = category_1.categoryList.findIndex(u => u.categoryId == +req.params.categoryId);
                    category_1.categoryList.splice(index, 1); // delete category
                    res.status(204).send();
                }
                else
                    res.status(404).json({ status: 404, message: 'Category not Found' });
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
//# sourceMappingURL=categories.js.map