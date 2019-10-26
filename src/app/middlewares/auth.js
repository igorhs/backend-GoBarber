import jwt from 'jsonwebtoken';

import { promisify } from 'util';

// É aqui que está o Token que criamos manualmente para o Payload que
// compõe o Token gerado pelo JWT
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Se este Header (que possui o Token) não estiver presente, retornar o erro.
  if (!authHeader) {
    return res.status(401).json({ error: 'Token was not provided.' });
  }

  // Agora vamos separar nosso Token de Bearer utilizando o método split e
  // desestruturando este array deixando apenas o nosso Token
  const [, token] = authHeader.split(' ');

  // Verificação de autenticação entre o
  // Token gerado pelo JWT e o Token que geramos manualmente
  // Se estiver ok, o usuário pode seguir com as alterações
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Como sabemos que está tudo ok,
    // podemos aproveitar o ID deste usuário e direcioná-lo para edição dos seus dados
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid.' });
  }
};
