/* importa o metodo Router de dentro do express para nao importar o
express inteiro */
import { Router } from 'express';

// import User from './app/models/User';

// importa o UserController
import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';
import PlansController from './app/controllers/PlansController';
import authMiddleware from './app/middleware/auth';

// cria variavel routes que ira conter o metodo Routes
const routes = new Router();

// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
// rota para listar planos o usuario tambem pode ter acesso
routes.get('/plans', PlansController.index);
// routes para definir o middleware para todas as rotas daqui para baixo
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.post('/students', StudentsController.store);
routes.put('/students/:index', StudentsController.update);
// rotas para os planos
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Filipe Macedo',
//     email: 'lipe_macedo@msn.com',
//     password_hash: '119e84354987',
//   });

//   return res.json(user);
// });

export default routes;
