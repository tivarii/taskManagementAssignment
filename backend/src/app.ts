import express from 'express';
import cors from 'cors';
import userRouter from './routers/user.router';
import taskRouter from './routers/task.router';
const app = express();

app.use(cors());
app.use(express.json());

// User authentication routes
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'ok' , msg:"runing fine"});
});


export default app;
