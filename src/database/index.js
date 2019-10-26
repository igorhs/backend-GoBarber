import Sequelize from 'sequelize';

// Importando as configurações do DB
import databaseConfig from '../config/database';

import User from '../app/models/User';

// Criando um Array com todos os Models da aplicação para que
// os dados sejam levados para a respectiva tabela no DB
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Esta variável vai permitir que seja feita a conexão a partir de UM ou MAIS Models
    // Neste momento, apenas do Model User
    this.connection = new Sequelize(databaseConfig);

    // Aqui vamos percorrer exatamente o model User no array models e fazer a conexão
    // com this.connection
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
