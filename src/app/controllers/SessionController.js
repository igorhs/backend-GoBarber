import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authconfig from '../../config/auth';
import User from '../models/User';

// Este é o controle da sessão (login) de usuário
class SessionController {
  async store(req, res) {
    // Validação dos campos de req.body utilizando Yup
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    // Se a validação acima falhar, retornar o seguinte erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // Aqui checamos se o e-mail do usuário bate com o cadastrado
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // Aqui checamos se a senha do usuário bate com a senha cadastrada
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authconfig.secret, {
        expiresIn: authconfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
