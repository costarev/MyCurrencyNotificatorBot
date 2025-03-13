import { HALF_HOUR } from "./consts.js";
import { isNight, toUTC } from "./helpers.js";
import { getCurrency } from "./currency.js";

const subscribers = new Set();

export function handleSubscribers() {
  setInterval(async () => {
    if (isNight()) {
      return;
    }

    const currency = await getCurrency();

    subscribers.forEach(async (id) => {
      await bot.telegram.sendMessage(
        id,
        `
      UPDATES ${toUTC(currency.lastUpdate)}
      
      USD sell from 200: ${currency.usdSellFrom200}
      USD sell from 1000: ${currency.usdSellFrom1000}
      EUR sell from 200: ${currency.eurSellFrom200}
      EUR sell from 1000: ${currency.eurSellFrom1000}`
      );
    });
  }, HALF_HOUR);
}

export function subscribe(id) {
  if (subscribers.has(id)) {
    return false;
  }

  subscribers.add(id);
  return true;
}

export function unsubscribe(id) {
  if (!subscribers.has(id)) {
    return false;
  }

  subscribers.delete(id);
  return true;
}
