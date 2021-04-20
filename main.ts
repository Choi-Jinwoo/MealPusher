import 'reflect-metadata';

import { MealCode, MealCodeUtil, Neis } from './lib/neis';
import Container from 'typedi';
import { DotEnv } from './config/dotenv';
import { GoogleMailer } from './lib/mail';
import dayjs from 'dayjs';
import { emails } from './data';

const dotEnv = Container.get(DotEnv);

const schoolCode = dotEnv.get('SCHOOL_CODE');
const officeCode = dotEnv.get('OFFICE_CODE');
const neis = new Neis(schoolCode, officeCode);

const hour = dayjs().get('hour');
let mealCode: MealCode | null = null;

console.log(hour, dayjs().toString());

if (hour <= 7) {
  mealCode = MealCode.Breakfast;
} else if (hour <= 12) {
  mealCode = MealCode.Lunch;
} else if (hour <= 18) {
  mealCode = MealCode.Dinner;
}

if (mealCode !== null) {
  neis.fetchDish(2021, 3, 20, MealCode.Breakfast)
    .then((dishes) => {
      const user = dotEnv.get('GOOGLE_EMAIL');
      const pass = dotEnv.get('GOOGLE_PW');
      const mailer = new GoogleMailer(user, pass);

      const strMealCode = MealCodeUtil.toString(mealCode as MealCode);
      const htmlTemplate = mailer.dishHTMLTemplate(dishes, mealCode as MealCode);

      return mailer.send(`오늘 ${strMealCode}의 급식 정보`, htmlTemplate, emails);
    })
    .then((data) => {
      console.log(data);
    })
}
