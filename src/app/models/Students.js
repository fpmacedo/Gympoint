// ARQUIVO PARA DEFINIR O MODEL STUDENTS
import Sequelize, { Model } from 'sequelize';
// importa o bcrypt para hash password
// import bcrypt from 'bcryptjs';

class Students extends Model {
  // cria o metodo init do arquivo para ser chamado pelo index.js
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.FLOAT,
        height: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
    // // hook utilizado para executar algum trecho de codigo antes
    // // de algo, exemplo beforesave antes de salvar executa o trecho
    // this.addHook('beforeSave', async user => {
    //   // if para so gerar o hash se estiver criando senha
    //   if (user.password) {
    //     user.password_hash = await bcrypt.hash(user.password, 8);
    //   }
    // });

    return this;
  }

  // metodo para verificar se o parametro password passado e o hash
  // sao iguais verificando se a senha e verdadeira
  // checkPassword(password) {
  //   return bcrypt.compare(password, this.password_hash);
  // }
}

export default Students;
