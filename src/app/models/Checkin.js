// ARQUIVO PARA DEFINIR O MODEL
import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  // cria o metodo init do arquivo para ser chamado pelo index.js
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
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

export default Checkin;
