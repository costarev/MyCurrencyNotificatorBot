export const getMskHours = () => {
  return (new Date().getUTCHours() + 3) % 24;
};

export const isNight = () => {
  const hour = getMskHours();

  return hour < 9 || hour > 20;
};

export const toUTC = (date) => new Date(date).toUTCString();
