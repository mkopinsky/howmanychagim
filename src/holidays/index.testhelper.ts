import { createMockJcItem } from "./hebcalClient.testhelper";
import { JcHoliday } from "./hebcalClient";
import { HmcHoliday } from "./index";

let cntMockHmcHolidays = 0;
export const createMockHmcHoliday = ({ subcat, date, title, isWeekend, isYomTov }: { subcat: JcHoliday['subcat'], date?: Date, title?: string, isWeekend?: boolean, isYomTov?: boolean }): HmcHoliday => {
    const ixMock = ++cntMockHmcHolidays;
    if (!date) date = new Date(2025, 3, 23);

    const jcHoliday = createMockJcItem({ category: 'holiday', date, title }) as JcHoliday;
    jcHoliday.subcat = subcat;

    return {
        ...jcHoliday,
        jsDate: date,
        hebrew_date: `Mock Hebrew Date ${ixMock}`,
        hebrew_date_title: `Mock Hebrew Date Title ${ixMock}`,
        month: date.getMonth(),
        isWeekend: isWeekend ?? false,
        yomtov: isYomTov ?? false
    } as HmcHoliday;
};
