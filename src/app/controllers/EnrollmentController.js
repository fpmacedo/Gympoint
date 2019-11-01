// CRIA O CONTROLLER PARA O USUARIO OU SEJA A INTERFACE ENTRE
// O FRONT E O BD

// importa o modelo usuario
import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';
// importa o yup para fazer validacoes

// cria a classe que sera exportada
class EnrollmentController {
  // informa que o store metodo de armazenar e assincrono
  async store(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.string().required(),
      start_date: Yup.date().required(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;
    /*
    // // verifica se ja existe algum id igual no BD
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id: student_id },
    });

    if (enrollmentExists) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Enrollment already exists.' });
    } */

    // busca o id e a duracao do plano
    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    // busca o id do aluno
    const student = await Students.findByPk(student_id);

    if (!student) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    // soma o numero de meses na data e joga para o corpo da requisicao
    req.body.end_date = addMonths(parseISO(start_date), plan.duration);
    // multiplica o valor de meses pelo preco e joga para o corpo da requisicao
    req.body.price = plan.duration * plan.price;
    // req.body.plan_id = 3;
    // // cria o usuario utilizando os dados do req.body e o metodo create
    // // e escolhe apenas alguns campos para retornar ao front end
    // const { id, title, duration, price } = await Enrollment.create(req.body);
    // // retorna como json ao usuario

    const { end_date, price } = await Enrollment.create(req.body);
    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }
  /*
  async index(req, res) {
    const plans = await Plans.findAll();
    return res.json(plans);
  }

  async update(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.string().required(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // busca id na req.params http://localhost:3333/plans/4 onde 4 = id
    const { id } = req.params;
    // busca o plano dentro do BD pela primary key que definimos como ID
    const plan = await Plans.findByPk(id);
    // verifica se o plano id foi encontrado
    if (!plan) {
      return res.status(400).json(`Plan id: ${id} does not exist`);
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    // busca id na req.params http://localhost:3333/plans/4 onde 4 = id
    const { id } = req.params;

    // busca o plano dentro do BD pela primary key que definimos como ID
    const plan = await Plans.findByPk(id);

    // verifica se o plano com o ID passado existe
    if (!plan) {
      return res.status(400).json(`Plan id: ${id} does not exist`);
    }
    // deleta o plano do banco de dados
    plan.destroy();
    // retorna para o usuario
    return res.json(`Plan ${plan.title} deleted`);
  } */
}

export default new EnrollmentController();
