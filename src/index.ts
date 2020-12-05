import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { userRouter } from './routes/users';
import cors from 'cors';
import { postRouter } from './routes/posts';
import { categoryRouter } from './routes/categories';
import { postCategoryRouter } from './routes/postcategories';
import { commentRouter } from './routes/comments';

let indexHtml = fs.readFileSync('./views/index.html');   // import HTML file to display a Help page as a response  

export const secret : string = '73F8C34C94EBB28E95279B6CC495F32A454F1FE2B92BEC88E2868E9D1858C3DC';


let app = express(); 
const port = 3000;

app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));

app.use(bodyParser.json());

app.use(userRouter);
app.use(postRouter);
app.use(categoryRouter);
app.use(postCategoryRouter);
app.use(commentRouter);


app.use('/',(req,res,next)=> {
    res.set('Content-Type', 'text/html');
    res.send(indexHtml); 
}); 

app.use('*', function (req, res) { 
    res.set('Content-Type', 'text/html');
    res.send(indexHtml); 
}) 

app.listen(port, ()=> {
    console.log(`listening at http://localhost:${port}`);
});