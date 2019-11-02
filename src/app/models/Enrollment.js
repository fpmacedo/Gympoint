// ARQUIVO PARA DEFINIR O MODEL STUDENTS
import Sequelize, { Model } from 'sequelize';
// importa o bcrypt para hash password
// import bcrypt from 'bcryptjs';

class Enrollment extends Model {
  // cria o metodo init do arquivo para ser chamado pelo index.js
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
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
    this.belongsTo(models.Plans, {
      foreignKey: 'plan_id',
      as: 'plans',
    });
  }
}

export default Enrollment;
