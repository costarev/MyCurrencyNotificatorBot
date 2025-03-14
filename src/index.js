import { Telegraf } from "telegraf";
import { getCurrency } from "./currency.js";
import { toUTC } from "./helpers.js";
import { handleSubscribers, subscribe, unsubscribe } from "./subscribe.js";

const API_KEY = process.env.API_KEY;
const bot = new Telegraf(API_KEY);

bot.command("usd", async (ctx) => {
  const currency = await getCurrency();

  ctx.sendMessage(
    `
LAST UPDATE ${toUTC(currency.lastUpdate)}

USD sell from 200: ${currency.usdSellFrom200}
USD sell from 1000: ${currency.usdSellFrom1000}`
  );
});

bot.command("eur", async (ctx) => {
  const currency = await getCurrency();

  ctx.sendMessage(
    `
LAST UPDATE ${toUTC(currency.lastUpdate)}

EUR sell from 200: ${currency.eurSellFrom200}
EUR sell from 1000: ${currency.eurSellFrom1000}`
  );
});

bot.command("subscribe", async (ctx) => {
  const success = subscribe(ctx.chat.id);

  ctx.sendMessage(success ? "Success!" : "You are already subscribed!");
});

bot.command("unsubscribe", async (ctx) => {
  const success = unsubscribe(ctx.chat.id);

  ctx.sendMessage(success ? "Success!" : "You are not subscriber!");
});

bot.launch(() => {
  handleSubscribers(bot);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
