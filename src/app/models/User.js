import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Antes de salvarmos, vamos criptografar a senha do usuário
    this.addHook('beforeSave', async user => {
      // Se o usuário definiu a senha, vamos criptografar
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Aqui realizamos a verificação se esta senha bate com o hash desta senha
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
