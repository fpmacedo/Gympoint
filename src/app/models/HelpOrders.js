// ARQUIVO PARA DEFINIR O MODEL
import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  // cria o metodo init do arquivo para ser chamado pelo index.js
  static init(sequelize) {
    super.init(
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // cria o metodo para associar o campo ao model de matricula
  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'students',
    });
  }
}

export default HelpOrders;
