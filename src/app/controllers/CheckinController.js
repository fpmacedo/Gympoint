import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Students from '../models/Students';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    // busca o id do aluno
    const student = await Students.findByPk(id);
    // verifica se o aluno realmente existe
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

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

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (checkins) {
      if (checkins.length >= 5) {
        return res
          .status(400)
          .json({ error: 'You can only do 5 check-ins every 7 days' });
      }
    }

    const { student_id } = await Checkin.create({
      student_id: id,
    });

    return res.json({
      student_id,
    });
  }

  async index(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
