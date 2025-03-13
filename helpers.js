export const isNight = () => {
  const hour = new Date().getHours();

  return (hour >= 0 && hour < 8) || hour > 21;
};
