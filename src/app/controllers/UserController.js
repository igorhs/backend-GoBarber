import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Método que vai permitir criarmos usuário através das rotas
  async store(req, res) {
    // Validação dos campos de req.body utilizando Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Se a validação acima falhar, retornar o seguinte erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verificando a existencia de um usuário utilizando o método findOne
    // Obrigatoriamente utilizar a regra where para fazermos a busca
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User exists already.' });
    }

    // Recebendo os campos do formulário (corpo da requisição) e mandando para o DB
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // console.log(req.userId);

    // Validação dos campos de req.body utilizando Yup
    // Importante: como aqui estamos editando as informações do usuário, os campos nome e e-mail
    // não são obrigatórios
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),

      // Se ele digitou a senha antiga, ele quer redefinir
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),

      // Aqui precisamos confirmar a nova senha do usuário
      // Se ele quis redefinir, aqui confirmamos
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Se a validação acima falhar, retornar o seguinte erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    // Buscando o usuário que será editado no DB
    // comparando o ID informado na requisição com o ID armazenado no DB
    const user = await User.findByPk(req.userId);

    // Aqui só será possível alterar o e-mail do usuário SE
    // o novo e-mail for diferente do que JÁ existe
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User exists already.' });
      }
    }

    // Aqui só será possível alterar a senha do usuário SE
    // a nova senha for diferente da que JÁ existe

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Aqui pegamos os outros campos informados no corpo da requisição e
    // mandamos para o DB
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
