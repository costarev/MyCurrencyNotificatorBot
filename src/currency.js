import { JSDOM } from "jsdom";
import { TEN_MINUTES } from "./consts.js";

const currencyState = {
  usdSellFrom200: 0,
  usdSellFrom200Diff: 0,
  usdSellFrom1000: 0,
  usdSellFrom1000Diff: 0,
  eurSellFrom200: 0,
  eurSellFrom200Diff: 0,
  eurSellFrom1000: 0,
  eurSellFrom1000Diff: 0,
  lastUpdate: 0,
};

async function getCurrencyHtml() {
  const res = await fetch("https://www.valuta812.ru/");
  const text = await res.text();

  return new JSDOM(text);
}

async function getCurrencyFromHtml() {
  const html = await getCurrencyHtml();
  const usdSellFrom200Element = html.window.document.querySelector(
    '[course_flag="usd_sell_from_1000"]'
  );
  const usdSellFrom1000Element = html.window.document.querySelector(
    '[course_flag="usd_sell_from_10000"]'
  );
  const eurSellFrom200Element = html.window.document.querySelector(
    '[course_flag="eur_sell_from_1000"]'
  );
  const eurSellFrom1000Element = html.window.document.querySelector(
    '[course_flag="eur_sell_from_10000"]'
  );

  return {
    usdSellFrom200: Number(usdSellFrom200Element.textContent),
    usdSellFrom1000: Number(usdSellFrom1000Element.textContent),
    eurSellFrom200: Number(eurSellFrom200Element.textContent),
    eurSellFrom1000: Number(eurSellFrom1000Element.textContent),
  };
}

async function updateCurrency() {
  const now = Date.now();

  try {
    const actualCurrency = await getCurrencyFromHtml();

    currencyState.usdSellFrom1000Diff =
      actualCurrency.usdSellFrom1000 - currencyState.usdSellFrom1000;
    currencyState.usdSellFrom1000 = actualCurrency.usdSellFrom1000;

    currencyState.usdSellFrom200Diff =
      actualCurrency.usdSellFrom200 - currencyState.usdSellFrom200;
    currencyState.usdSellFrom200 = actualCurrency.usdSellFrom200;

    currencyState.eurSellFrom1000Diff =
      actualCurrency.eurSellFrom1000 - currencyState.eurSellFrom1000;
    currencyState.eurSellFrom1000 = actualCurrency.eurSellFrom1000;

    currencyState.eurSellFrom200Diff =
      actualCurrency.eurSellFrom200 - currencyState.eurSellFrom200;
    currencyState.eurSellFrom200 = actualCurrency.eurSellFrom200;

    currencyState.lastUpdate = now;
  } catch (e) {}
}

export async function getCurrency() {
  if (Date.now() - currencyState.lastUpdate > TEN_MINUTES) {
    await updateCurrency();
  }

  return {
    ...currencyState,
  };
}
