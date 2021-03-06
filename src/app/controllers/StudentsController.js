// CRIA O CONTROLLER PARA O USUARIO OU SEJA A INTERFACE ENTRE
// O FRONT E O BD

// importa o modelo usuario
import * as Yup from 'yup';
import { Op } from 'sequelize';
import Students from '../models/Students';
// importa o yup para fazer validacoes

// cria a classe que sera exportada
class StudentsController {
  async index(req, res) {
    const { name, page, id } = req.query;

    if (page) {
      const students = await Students.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        // limita em 20 registros por pagina
        limit: 20,
        // faz com que nao seja pulado nenhum registro
        offset: (page - 1) * 20,
      });
      return res.json(students);
    }
    if (id) {
      // busca o usuario dentro do BD pela primary key que definimos como ID
      const student = await Students.findByPk(id);

      return res.json(student);
    }
    const students = await Students.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    return res.json(students);
  }

  // informa que o store metodo de armazenar e assincrono
  async store(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // verifica se ja existe algum email igual no BD
    const studentExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'User already exists.' });
    }
    // cria o usuario utilizando os dados do req.body e o metodo create
    // e escolhe apenas alguns campos para retornar ao front end
    const { id, name, email, age, height, weight } = await Students.create(
      req.body
    );
    // retorna como json ao usuario
    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  // METODO PARA USUARIO FAZER ATUALIZACAO DE CADASTRO
  async update(req, res) {
    // cri um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string(),
      weight: Yup.string(),
      height: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // buscar email
    const { email } = req.body;

    // busca id na req.params http://localhost:3333/students/4 onde 4 = index
    const { index } = req.params;
    // busca o usuario dentro do BD pela primary key que definimos como ID
    const students = await Students.findByPk(index);

    if (!students) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Student does not exists.' });
    }
    // verifica se o e-mail novo e diferente do atual
    if (email !== students.email) {
      const studentExists = await Students.findOne({ where: { email } });

      if (studentExists) {
        // caso ja exista retorna ao user bad request
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const { id, name, age, weight, height } = await students.update(req.body);

    return res.json({
      id,
      name,
      age,
      email,
      weight,
      height,
    });
  }

  async delete(req, res) {
    // busca id na req.params http://localhost:3333/student/4 onde 4 = id
    const { id } = req.params;

    // busca o plano dentro do BD pela primary key que definimos como ID
    const students = await Students.findByPk(id);

    // verifica se o enrollment com o ID passado existe
    if (!students) {
      return res.status(400).json(`Student id: ${id} does not exist`);
    }
    students.destroy();
    // retorna para o usuario
    return res.json(`Student ${students.id} deleted`);
  }
}

export default new StudentsController();
