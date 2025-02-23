import { DateTime } from 'luxon';

const SOLAR_YEAR = 365.2587565;
const LUNAR_MONTH = 29.53058795;
const MYAN_Y_ZERO = 1954168.050623;

const JULIAN_EPOCH = DateTime.fromObject({
  year: -4713,
  month: 11,
  day: 24,
  hour: 5,
}).toUTC();

function greg2JulianInSecs(date) {
  return date.diff(JULIAN_EPOCH, 'seconds').seconds / 86400;
}

function utcDateTime(year, month, day, hour, minute, second) {
  return DateTime.utc(year, month, day, hour, minute, second);
}

function jul2Mm(jdn) {
  let jd = Math.round(jdn);
  let my = Math.floor((jd - 0.5 - MYAN_Y_ZERO) / SOLAR_YEAR);
  let [tagu1stDay, myanYType] = checkMyanmarYear(my);
  let buddhistYear = my + 1182;
  let dd = jd - Math.round(tagu1stDay) + 1;
  let b = Math.floor(myanYType / 2);
  let c = Math.floor(1 / (myanYType + 1));
  
  let myl = 354 + (1 - c) * 30 + b;
  if (isNaN(myl) || myl === 0) {
    myl = 354; // Default value for safety
  }

  let mmt = Math.floor((dd - 1) / myl);
  dd -= mmt * myl;
  let a = Math.floor((dd + 423) / 512);
  
  let mm = Math.floor((dd - b * a + c * a * 30 + 29.26) / 29.544);
  if (isNaN(mm) || mm <= 0) {
    mm = 1; // Default value for safety
  }

  let e = Math.floor((mm + 12) / 16);
  let f = Math.floor((mm + 11) / 16);
  let md = dd - Math.floor(29.544 * mm - 29.26) - b * e + c * f * 30;
  if (isNaN(md) || md < 1 || md > 30) {
    md = 1; // Ensure md is within valid range
  }

  mm += f * 3 - e * 4;
  if (mm <= 0) {
    mm = 1; // Ensure mm is within valid range
  }

  let mml = 30 - (mm % 2);
  if (mm === 3) mml += b;
  let mp = Math.floor((md + 1) / 16) + Math.floor(md / 16) + Math.floor(md / mml);
  let fd = md - 15 * Math.floor(md / 16);
  let wd = (jd + 2) % 7;
  let yearTransit = false;
  let watatNextYear = false;

  // Correct transition check
  if (dd === 1 && mm === 1 && jd !== jul2Mm(jdn - 1).jd) {
    my += 1;
    [tagu1stDay, myanYType] = checkMyanmarYear(my);
    dd = jd - Math.round(tagu1stDay) + 1;
  }

  console.log(`jdn: ${jdn}, jd: ${jd}, my: ${my}, myl: ${myl}, mm: ${mm}, md: ${md}, mp: ${mp}`);

  return {
    myanmarYear: my,
    buddhistYear: buddhistYear,
    tagu1stDay: tagu1stDay,
    yearType: myanYType,
    yearLength: myl,
    month: mm,
    monthType: mmt,
    monthLength: mml,
    monthDay: md,
    fortnightDay: fd,
    moonPhase: mp,
    weekDay: wd,
    yearTransit: yearTransit,
    watatNextYear: watatNextYear
  };
}

function checkMyanmarYear(myanmarYear) {
  let myanYType = 0;
  let yd = 0;
  let y1Watat;
  let y1Fm;
  let nd = 0;
  let tagu1stDay = 0;

  let y2Watat = new CheckWatat(myanmarYear).watat;
  let y2Fm = new CheckWatat(myanmarYear).fullMoonDay2ndWaso;

  myanYType = y2Watat;

  do {
    yd++;
    y1Watat = new CheckWatat(myanmarYear - yd).watat;
    y1Fm = new CheckWatat(myanmarYear - yd).fullMoonDay2ndWaso;
  } while (y1Watat == 0 && yd < 3);

  if (myanYType != 0) {
    nd = ((y2Fm - y1Fm) % 354);
    myanYType = Math.floor(nd / 31) + 1;

    if (nd != 30 && nd != 31) {
      return 'Watat Error';
    }
  } else {
    // fullMoonDay2ndWaso = y1Fm + (354 * yd);
  }

  tagu1stDay = y1Fm + (354 * yd) - 102;

  return [tagu1stDay, myanYType];
}

class CheckWatat {
  constructor(myanmarYear) {
    this.myanmarYear = myanmarYear;
    this.watatOffset = -0.5;
    this.numMonth = 8;
    this.watat = 0;
    this.lunarMonth = LUNAR_MONTH;
    this.fullMoonDay2ndWaso = 0;

    let tresholdVal = ((SOLAR_YEAR / 12) - this.lunarMonth) * (12 - this.numMonth);
    let excessDay = (SOLAR_YEAR * (myanmarYear + 3739)) % this.lunarMonth;
    if (excessDay < tresholdVal) {
      excessDay += this.lunarMonth;
    }

    this.checkEDtoLM = this.lunarMonth - (SOLAR_YEAR / 12 - this.lunarMonth) * this.numMonth;
    if (excessDay >= this.checkEDtoLM) {
      this.watat = 1;
    } else {
      this.watat = 0;
    }

    this.fullMoonDay2ndWaso = (SOLAR_YEAR * myanmarYear +
      MYAN_Y_ZERO -
      excessDay +
      (4.5 * this.lunarMonth) +
      this.watatOffset);
  }
}

function findUposathaDays(year) {
  let uposathaDays = [];

  let startDate = utcDateTime(year, 1, 1, 0, 0, 0);
  let endDate = utcDateTime(year, 12, 31, 23, 59, 59);

  for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
    let jdn = greg2JulianInSecs(date) + 0.5;
    let myanmarDate = jul2Mm(jdn);
    let moonPhase = myanmarDate.moonPhase;

    console.log(`Date: ${date.toISO()}, Moon Phase: ${moonPhase}`);

    if (moonPhase === 1 || moonPhase === 3) {
      uposathaDays.push(date);
    }
  }

  return uposathaDays;
}

let year = 2026;
let uposathaDays = findUposathaDays(year);

uposathaDays.forEach(day => {
  console.log(day.toISO());
});
