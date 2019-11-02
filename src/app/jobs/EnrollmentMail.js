import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, end_date } = data;

    // console.log(student.name);
    // envia o email para o usuario
    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: 'Confirmacao de matricula',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        date: format(parseISO(end_date), "'dia' dd 'de'MMMM' de 'yyyy'", {
          locale: pt,
        }),
        price: plan.price,
      },
    });
  }
}

export default new EnrollmentMail();
