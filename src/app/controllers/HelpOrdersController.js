// CRIA O CONTROLLER PARA O USUARIO OU SEJA A INTERFACE ENTRE
// O FRONT E O BD

// importa o modelo usuario
import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';
import Students from '../models/Students';
import HelpOrders from '../models/HelpOrders';
import Queue from '../../lib/Queue';
import AnsweredOrderMail from '../jobs/AnsweredOrderMail';

// importa o yup para fazer validacoes

// cria a classe que sera exportada
class HelpOrdersController {
  // informa que o store metodo de armazenar e assincrono
  async store(req, res) {
    const { id } = req.params;
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // const { question } = req.body;

    // busca o id do aluno
    const student = await Students.findByPk(id);
    // verifica se o aluno realmente existe

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }
    // joga o id do aluno para dentro da requisicao
    req.body.student_id = id;
    // busca o id do aluno
    const enrollment = await Enrollment.findOne({
      where: { student_id: id },
    });
    // verifica se o aluno realmente tem uma matricula
    if (!enrollment) {
      return res
        .status(400)
        .json({ error: 'Student does not have an enrollment.' });
    }

    const {
      student_id,
      question,
      answer,
      answer_at,
      created_at,
      updated_at,
    } = await HelpOrders.create(req.body);

    return res.json({
      student_id,
      question,
      answer,
      answer_at,
      created_at,
      updated_at,
    });
  }

  async index(req, res) {
    const { id } = req.params;

    if (id) {
      const help_orders = await HelpOrders.findAll({
        where: {
          student_id: id,
        },
      });
      return res.json(help_orders);
    }

    const help_orders = await HelpOrders.findAll();
    return res.json(help_orders);
  }

  async answer(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    // busca o id do aluno
    const order = await HelpOrders.findByPk(id);
    // verifica se o aluno realmente existe

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    if (order.answer) {
      return res
        .status(400)
        .json({ error: 'This order allready have an answer.' });
    }

    const help_order = await HelpOrders.findByPk(id);

    req.body.answer_at = new Date();

    const {
      student_id,
      question,
      answer,
      answer_at,
      created_at,
      updated_at,
    } = await help_order.update(req.body);

    const student = await Students.findByPk(student_id);

    // chama a fila para enviar emails
    await Queue.add(AnsweredOrderMail.key, { student, help_order });

    return res.json({
      student_id,
      question,
      answer,
      answer_at,
      created_at,
      updated_at,
    });

    // return res.json();
  }
}

export default new HelpOrdersController();
