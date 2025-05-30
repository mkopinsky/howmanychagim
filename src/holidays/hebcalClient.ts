// Wrapper around Hebcal REST APIs

export interface JcResponse {
    title: string; // Calendar title, e.g. "Hebcal Diaspora 2025"
    date: string; // Date the calendar was generated, in ISO-8701 format
    range: JcDateRange; // Date range of the calendar, e.g. { start: "2025-01-01", end: "2025-12-31" }
    items: JcItem[];
}

export interface JcDateRange {
    start: string; // ISO date string, e.g. "2025-01-01"
    end: string;   // ISO date string, e.g. "2025-12-31"
}

export interface JcItem {
    category: 'hebdate' | 'holiday' | 'roshchodesh' | 'parashat' | 'mevarchim';

    title: string; // Title in English and / or transliterated Hebrew
    hebrew: string; // Title in Hebrew characters

    date: string; // Date the item occurs in ISO-8701 format, e.g. "2025-01-01"
    hdate: string; // Hebrew date in the format "1 Nisan 5784"

    memo?: string; // Text description of the item
    link?: string; // Link to item on hebcal.com
}

export interface JcHoliday extends JcItem {
    subcat: 'major' | 'minor' | 'fast' | 'shabbat' | 'modern'; // 'Holiday' is used generically; subcat defines type
    yomtov?: boolean; // true if issur melacha
}

/**
 * https://www.hebcal.com/home/195/jewish-calendar-rest-api
 * @param year Year to get holidays for
 * @returns Promise that resolves to an array of holidays for the specified year
 */
export const getYear = async (year: number): Promise<JcResponse> => {
    const url = `https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=${year}&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};