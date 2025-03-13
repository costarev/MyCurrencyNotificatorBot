import { Telegraf } from "telegraf";
import { getCurrency } from "./currency.js";
import { ONE_HOUR } from "./consts.js";
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
      `UPDATES\n\nUSD sell from 200: ${currency.usdSellFrom200}\nUSD sell from 1000: ${currency.usdSellFrom1000}`
    );
  });
}, ONE_HOUR);

bot.command("usd", async (ctx) => {
  const currency = await getCurrency();

  ctx.sendMessage(
    `Sell from 200: ${currency.usdSellFrom200}\nSell from 1000: ${currency.usdSellFrom1000}`
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
