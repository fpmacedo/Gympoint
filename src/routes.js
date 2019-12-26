/* importa o metodo Router de dentro do express para nao importar o
express inteiro */
import { Router } from 'express';

// import User from './app/models/User';

// importa o UserController
import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentController';
import authMiddleware from './app/middleware/auth';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

// cria variavel routes que ira conter o metodo Routes
const routes = new Router();

// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
// rota para listar planos o usuario tambem pode ter acesso
routes.get('/plans', PlansController.index);

// rotas para o checkin dos alunos
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

// rotas para pedidos de ajuda
routes.post('/students/:id/help-orders', HelpOrdersController.store);
routes.get('/students/:id/help-orders', HelpOrdersController.index);

// routes para definir o middleware para todas as rotas daqui para baixo
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.get('/students', StudentsController.index);
routes.post('/students', StudentsController.store);
routes.put('/students/:index', StudentsController.update);
// rotas para os planos
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);
// rotas para as matriculas
routes.post('/enrollments', EnrollmentController.store);
routes.get('/enrollments', EnrollmentController.index);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

// rotas para pedidos de ajuda
routes.post('/help-orders/:id/answer', HelpOrdersController.answer);

export default routes;
