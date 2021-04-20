import { DotEnv } from '../config/dotenv';
import { URLLib } from './url';
import Container from 'typedi';
import fetch from 'node-fetch';
import dayjs from 'dayjs';


export enum MealCode {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
}

export class MealCodeUtil {
  static toString(mealCode: MealCode): string {
    switch (mealCode) {
      case MealCode.Breakfast:
        return '조식'

      case MealCode.Lunch:
        return '중식'

      case MealCode.Dinner:
        return '석식'
    }
  }
}

const MEAL_ENDPOINT = 'https://open.neis.go.kr/hub/mealServiceDietInfo';

export class Neis {
  private readonly dotEnv: DotEnv;

  constructor(
    private readonly schoolCode: string,
    private readonly officeCode: string,
  ) {
    this.dotEnv = Container.get(DotEnv);
  }

  async fetchDish(year: number, month: number, date: number, mealCode: MealCode): Promise<string[]> {
    const mealDate = dayjs()
      .set('year', year)
      .set('month', month)
      .set('date', date)
      .format('YYYYMMDD');

    const neisKey = this.dotEnv.get('NEIS_KEY');

    const urlLib = new URLLib(MEAL_ENDPOINT);
    urlLib.setQuery({
      KEY: neisKey,
      Type: 'json',
      pIndex: 1,
      pSize: 100,
      ATPT_OFCDC_SC_CODE: this.officeCode,
      SD_SCHUL_CODE: this.schoolCode,
      MMEAL_SC_CODE: mealCode,
      MLSV_YMD: mealDate,
    });

    console.log(urlLib.url);

    const response = await fetch(urlLib.url);
    const responseJson = await response.json();
    if (responseJson['mealServiceDietInfo'] === undefined) {
      throw new Error('해당하는 데이터가 없습니다');
    }

    const rawDish: string = responseJson['mealServiceDietInfo'][1]['row'][0]['DDISH_NM'];
    const dishes = rawDish.split('<br/>');

    return dishes;
  }
}