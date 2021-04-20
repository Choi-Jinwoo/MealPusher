import { createTransport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { MealCode, MealCodeUtil } from './neis';

type MailService = 'gmail' | 'naver';

export abstract class Mailer {
  private readonly transporter: Transporter;
  private readonly user: string;

  constructor(service: MailService, user: string, pass: string) {
    this.user = user;
    this.transporter = createTransport({
      service,
      auth: {
        user,
        pass,
      }
    });
  }

  async send(subject: string, html: string, mails: string[]): Promise<void> {
    const options: MailOptions = {
      from: this.user,
      to: mails,
      subject,
      html,
    }

    return this.transporter.sendMail(options);
  }

  dishHTMLTemplate(dishes: string[], mealCode: MealCode): string {
    const strMealCode = MealCodeUtil.toString(mealCode);
    console.log(dishes);


    const html =
      `<h3>오늘의 ${strMealCode}입니다</h3>

      ${dishes.map(dish => `<p>${dish}</p>`).join('')}`

    console.log(html);

    return html;
  }
}

export class GoogleMailer extends Mailer {
  constructor(user: string, pass: string) {
    super('gmail', user, pass);
  }
}