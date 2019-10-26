import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Importanto o Middleware
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Passando como parâmetro UserController.store para que possamos criar os usuários
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Como estamos utilizando o Middleware de verificação APÓS as duas rotas acima,
// ele é executado somente quando o usuário está logado
routes.use(authMiddleware);

routes.put('/users', UserController.update);
export default routes;
