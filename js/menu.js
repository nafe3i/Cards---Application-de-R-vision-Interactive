const burger = document.getElementById('burger');
const menu = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});
