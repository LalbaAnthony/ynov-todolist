const categoryController = require('./controllers/category');
const taskController = require('./controllers/task');
const userController = require('./controllers/user');

const checkToken = require('./middleware/checkToken');

const express = require('express');
const router = express.Router();

// Category
router.get('/categories', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategoryById);

// Seaons
router.get('/tasks', checkToken, taskController.getAllSeasons);
router.get('/task/:id', checkToken, taskController.getSeasonById);
router.post('/tasks', checkToken, taskController.createSeason);
router.put('/task/:id', checkToken, taskController.updateSeason);
router.delete('/task/:id', checkToken, taskController.deleteSeason);

// User
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/validate-token', userController.validateToken);
router.post('/verify-email', userController.verifyEmail);
router.get('/forgot-password', checkToken, userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/user-infos/:id', checkToken, userController.userInfos);
router.put('/user-update/:id', checkToken, userController.userUpdate);

module.exports = router;