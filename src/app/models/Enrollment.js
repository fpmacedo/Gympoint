// ARQUIVO PARA DEFINIR O MODEL STUDENTS
import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';
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
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            return (
              isBefore(this.get('start_date'), new Date()) &&
              isAfter(this.get('end_date'), new Date())
            );
          },
        },
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
