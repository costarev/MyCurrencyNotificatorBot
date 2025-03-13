import { Telegraf } from "telegraf";
import { getCurrency } from "./currency.js";
import { HALF_HOUR } from "./consts.js";
import { isNight } from "./helpers.js";

const API_KEY = process.env.API_KEY;
const bot = new Telegraf(API_KEY);
const subscribers = new Set();

setInterval(async () => {
  if (isNight()) {
    return;
  }

  const currency = await getCurrency();

  subscribers.forEach(async (id) => {
    await bot.telegram.sendMessage(
      id,
      `
UPDATES ${currency.lastUpdate}

USD sell from 200: ${currency.usdSellFrom200}
USD sell from 1000: ${currency.usdSellFrom1000}
EUR sell from 200: ${currency.eurSellFrom200}
EUR sell from 1000: ${currency.eurSellFrom1000}`
    );
  });
}, HALF_HOUR);

bot.command("usd", async (ctx) => {
  const currency = await getCurrency();

  ctx.sendMessage(
    `
LAST UPDATE ${currency.lastUpdate}

USD sell from 200: ${currency.usdSellFrom200}
USD sell from 1000: ${currency.usdSellFrom1000}`
  );
});

bot.command("eur", async (ctx) => {
  const currency = await getCurrency();

  ctx.sendMessage(
    `
LAST UPDATE ${currency.lastUpdate}

EUR sell from 200: ${currency.eurSellFrom200}
EUR sell from 1000: ${currency.eurSellFrom1000}`
  );
});

bot.command("subscribe", async (ctx) => {
  if (subscribers.has(ctx.chat.id)) {
    ctx.sendMessage("You are already subscribed!");

    return;
  }

  subscribers.add(ctx.chat.id);
  ctx.sendMessage("Success!");
});

bot.command("unsubscribe", async (ctx) => {
  if (!subscribers.has(ctx.chat.id)) {
    ctx.sendMessage("You are not subscriber!");

    return;
  }

  subscribers.delete(ctx.chat.id);
  ctx.sendMessage("Success!");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
