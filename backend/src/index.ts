import express from 'express';
import cors from 'cors';
import userRouter from './routers/user.router';

const app = express();

app.use(cors());
app.use(express.json());

// User authentication routes
app.use('/api/users', userRouter);

// Health check route
app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

export default app;
