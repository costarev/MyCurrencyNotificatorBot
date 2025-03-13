import { JSDOM } from "jsdom";
import { TEN_MINUTES } from "./consts.js";

const currencyCache = { usdSellFrom200: null, usdSellFrom1000: null };
let lastUpdate = 0;

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

  return {
    usdSellFrom200: usdSellFrom200Element.textContent,
    usdSellFrom1000: usdSellFrom1000Element.textContent,
  };
}

async function updateCurrency() {
  const currency = await getCurrencyFromHtml();

  currencyCache.usdSellFrom1000 = currency.usdSellFrom1000;
  currencyCache.usdSellFrom200 = currency.usdSellFrom200;
}

export async function getCurrency() {
  const now = Date.now();

  if (now - lastUpdate > TEN_MINUTES) {
    await updateCurrency();
    lastUpdate = now;
  }

  return currencyCache;
}
