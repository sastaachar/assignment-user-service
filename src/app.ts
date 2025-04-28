import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UserController } from './controllers/userController';
import { AuthController } from './controllers/authController';
import { authenticate, isAdmin } from './middleware/auth';

dotenv.config();

const app = express();
const userController = new UserController();
const authController = new AuthController();

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/token', authController.login.bind(authController));

// User routes
app.post('/api/user/register', userController.register.bind(userController));
app.get('/api/user/me', authenticate, userController.getCurrentUser.bind(userController));
app.post('/api/user/update', authenticate, userController.updateUser.bind(userController));
app.post('/api/user/delete', authenticate, userController.deleteUser.bind(userController));

// Admin routes
app.get('/api/admin/users', authenticate, isAdmin, userController.getAllUsers.bind(userController));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 