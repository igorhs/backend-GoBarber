// Configurações do DB

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'igorhen_rique',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true, // tabela exemplo: user_groups
    underscoredAll: true, // coluna exemplo: user_id
  },
};
