import { JSDOM } from "jsdom";
import { TEN_MINUTES } from "./consts.js";

const currencyState = {
  usdSellFrom200: null,
  usdSellFrom1000: null,
  eurSellFrom200: null,
  eurSellFrom1000: null,
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
    usdSellFrom200: usdSellFrom200Element.textContent,
    usdSellFrom1000: usdSellFrom1000Element.textContent,
    eurSellFrom200: eurSellFrom200Element.textContent,
    eurSellFrom1000: eurSellFrom1000Element.textContent,
  };
}

async function updateCurrency() {
  const now = Date.now();

  try {
    const currency = await getCurrencyFromHtml();

    currencyState.usdSellFrom1000 = currency.usdSellFrom1000;
    currencyState.usdSellFrom200 = currency.usdSellFrom200;
    currencyState.eurSellFrom1000 = currency.eurSellFrom1000;
    currencyState.eurSellFrom200 = currency.eurSellFrom200;
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
