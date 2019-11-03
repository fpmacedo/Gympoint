import Mail from '../../lib/Mail';

class AnsweredOrderMail {
  get key() {
    return 'AnsweredOrderMail';
  }

  async handle({ data }) {
    const { student, help_order } = data;

    // console.log('fila');
    // envia o email para o usuario
    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: 'Confirmacao de Ordem respondida',
      template: 'order',
      context: {
        student: student.name,
        question: help_order.question,
        answer: help_order.answer,
      },
    });
  }
}

export default new AnsweredOrderMail();
