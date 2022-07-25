let randomNum;

//slider
let prevSlide = document.querySelector('.slide-prev');
let nextSlide = document.querySelector('.slide-next');

//slider


const showTime = () => {
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
}

const showDate = () => {
    const displayedDate = document.querySelector('.date');
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: '2-digit' };
    const currentDate = date.toLocaleDateString('en-US', options);
    displayedDate.textContent = currentDate;
}

const showGreeting = () => {
    const greeting = document.querySelector('.greeting');
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours);
    const greetingText = `Good ${timeOfDay}`
    greeting.textContent = greetingText;
}

const getTimeOfDay = hours => {
    const timesOfDay = ['night', 'morning', 'day', 'evening'];

    return timesOfDay[Math.floor(hours / 6)];
}

const getRandomNum = () => {
    randomNum = Math.floor(Math.random() * 20) + 1;
}

//исправить, вызов самой себя, зациклтвания нет, но выглядит стремно
const setUserName = () => {
    const name = document.querySelector('.name');

    function setLocalStorage() {
        localStorage.setItem('name', name.value);
    }

    function getLocalStorage() {
        if (localStorage.getItem('name')) {
            name.value = localStorage.getItem('name');
        }
    }

    name.addEventListener('change', setUserName);
    window.addEventListener('beforeunload', setLocalStorage);
    window.addEventListener('DOMContentLoaded', getLocalStorage);
}


const setBg = () => {
    const body = document.body;
    const date = new Date();   //продублировано
    const hours = date.getHours(); //продублировано
    const timeOfDay = getTimeOfDay(hours);

    let bgNum;
    randomNum < 10 ? bgNum = "0" + randomNum : bgNum = randomNum.toString();
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    // const bgLink = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`;
    })
}

const getSlideNext = () => {
    randomNum < 20 ? randomNum++ : randomNum = 1;
    setBg();
}

const getSlidePrev = () => {
    randomNum > 1 ? randomNum-- : randomNum = 20;
    setBg();
}

prevSlide.addEventListener('click', getSlidePrev);
nextSlide.addEventListener('click', getSlideNext);


getRandomNum();
setUserName();
setBg();
showTime();
showGreeting();