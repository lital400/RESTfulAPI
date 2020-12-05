"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const users_1 = require("./routes/users");
const cors_1 = __importDefault(require("cors"));
const posts_1 = require("./routes/posts");
const categories_1 = require("./routes/categories");
const postcategories_1 = require("./routes/postcategories");
const comments_1 = require("./routes/comments");
let indexHtml = fs_1.default.readFileSync('./views/index.html'); // import HTML file to display a Help page as a response  
exports.secret = '73F8C34C94EBB28E95279B6CC495F32A454F1FE2B92BEC88E2868E9D1858C3DC';
let app = express_1.default();
const port = 3000;
app.use(cors_1.default({ credentials: true, origin: true }));
app.options('*', cors_1.default({ credentials: true, origin: true }));
app.use(body_parser_1.default.json());
app.use(users_1.userRouter);
app.use(posts_1.postRouter);
app.use(categories_1.categoryRouter);
app.use(postcategories_1.postCategoryRouter);
app.use(comments_1.commentRouter);
app.use('/', (req, res, next) => {
    res.set('Content-Type', 'text/html');
    res.send(indexHtml);
});
app.use('*', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.send(indexHtml);
});
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map