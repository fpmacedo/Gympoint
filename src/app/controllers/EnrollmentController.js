// CRIA O CONTROLLER PARA O USUARIO OU SEJA A INTERFACE ENTRE
// O FRONT E O BD

// importa o modelo usuario
import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Plans from '../models/Plans';
import Students from '../models/Students';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';
import Mail from '../../lib/Mail';

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

    // // verifica se ja existe algum student_id igual no BD
    // evitando que um usuario possua dois planos
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id },
    });

    if (enrollmentExists) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Enrollment already exists.' });
    }

    // busca o id e a duracao do plano
    const plan = await Plans.findByPk(plan_id);
    // verifica se o plano existe
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    // busca o id do aluno
    const student = await Students.findByPk(student_id);
    // verifica se o aluno realmente existe
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    // soma o numero de meses na data e joga para o corpo da requisicao
    req.body.end_date = addMonths(parseISO(start_date), plan.duration);
    // multiplica o valor de meses pelo preco e joga para o corpo da requisicao
    req.body.price = plan.duration * plan.price;

    const { end_date, price } = await Enrollment.create(req.body);

    await Queue.add(EnrollmentMail.key, { student, plan, end_date });

    /*
    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: 'Confirmacao de matricula',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        date: format(end_date, "'dia' dd 'de'MMMM' de 'yyyy'", {
          locale: pt,
        }),
        price: plan.price,
      },
    }); */

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll();
    return res.json(enrollments);
  }

  async update(req, res) {
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
    // busca id na req.params http://localhost:3333/plans/4 onde 4 = id
    const { id } = req.params;
    const { plan_id, start_date } = req.body;
    // busca o plano dentro do BD pela primary key que definimos como ID
    const enrollment = await Enrollment.findByPk(id);
    // verifica se o plano id foi encontrado
    if (!enrollment) {
      return res.status(400).json(`Enrrolment id: ${id} does not exist`);
    }

    // busca o id e a duracao do plano
    const plan = await Plans.findByPk(plan_id);
    // adiciona os meses referente a duracao do plano
    req.body.end_date = addMonths(parseISO(start_date), plan.duration);

    const { student_id, price, end_date } = await enrollment.update(req.body);

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    // busca id na req.params http://localhost:3333/plans/4 onde 4 = id
    const { id } = req.params;

    // busca o plano dentro do BD pela primary key que definimos como ID
    const enrollment = await Enrollment.findByPk(id);

    // verifica se o enrollment com o ID passado existe
    if (!enrollment) {
      return res.status(400).json(`Enrollment id: ${id} does not exist`);
    }
    // deleta o plano do banco de dados
    enrollment.destroy();
    // retorna para o usuario
    return res.json(`Enrollment ${enrollment.id} deleted`);
  }
}

export default new EnrollmentController();
