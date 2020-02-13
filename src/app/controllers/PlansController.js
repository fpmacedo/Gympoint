// CRIA O CONTROLLER PARA O USUARIO OU SEJA A INTERFACE ENTRE
// O FRONT E O BD

// importa o modelo usuario
import * as Yup from 'yup';
import Plans from '../models/Plans';
// importa o yup para fazer validacoes

// cria a classe que sera exportada
class PlansController {
  // informa que o store metodo de armazenar e assincrono
  async store(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.string().required(),
      totalPrice: Yup.string(),
    });
    // verifica se todos os parametros dentro do schema sao validos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // // verifica se ja existe algum email igual no BD
    const planExists = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      // caso ja exista retorna ao user bad request
      return res.status(400).json({ error: 'Plan already exists.' });
    }
    // cria o usuario utilizando os dados do req.body e o metodo create
    // e escolhe apenas alguns campos para retornar ao front end
    const { id, title, duration, price } = await Plans.create(req.body);
    // retorna como json ao usuario
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const { page, id } = req.query;
    if (page) {
      const plans = await Plans.findAll({
        // limita em 20 registros por pagina
        limit: 20,
        // faz com que nao seja pulado nenhum registro
        offset: (page - 1) * 20,
      });
      return res.json(plans);
    }
    if (id) {
      // busca o usuario dentro do BD pela primary key que definimos como ID
      const plan = await Plans.findByPk(id);

      return res.json(plan);
    }

    const plans = await Plans.findAll({});
    return res.json(plans);
  }

  async update(req, res) {
    // cria um objeto yup para a verificacao dos dados recebidos
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.string().required(),
      total: Yup.number(),
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
  }
}

export default new PlansController();
