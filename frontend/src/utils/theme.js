export const getCurrentTheme = () => {
  const hours = new Date().getHours();
  return hours >= 18 || hours < 6 ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};