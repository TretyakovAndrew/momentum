import playList from './assets/sounds/playList.js';

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

const getRandomNum = (bg = 20) => {
    if (bg != 20) {
        return Math.floor(Math.random() * bg);
    }
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



//WEATHER//
// TODO: выводится уведомление об ошибке при вводе некорректных значений, 
// для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
} else {
    city.value = 'Minsk';
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=89274f8372c411e6c202134024e9c1a5&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    setCityLocalStorage();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)}%`;
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
    getWeather();
}

function setCityLocalStorage() {
    localStorage.setItem('city', city.value);
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('change', setCity);



//quotes
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const quoteSwitchBtn = document.querySelector('.change-quote');

async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    const quoteNum = getRandomNum(data.length - 1);

    quote.textContent = data[quoteNum].text;
    author.textContent = data[quoteNum].author;
}
getQuotes();

quoteSwitchBtn.addEventListener('click', getQuotes);


const audio = new Audio();
const playPauseBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const playerPlayList = document.querySelector('.play-list');
let trackNum = 0;
let isPlay = false;

//player
function playAudio(trackNum) {
    if (isPlay === true) {
        //TODO протестировать с отсутствующими треками
        const allTracks = document.querySelectorAll('.play-item');
        audio.src = playList[trackNum].src;
        audio.currentTime = 0;
        audio.play();
        allTracks.forEach(element => {
            element.classList.remove('item-active');
        });
        allTracks[trackNum].classList.add('item-active');
    } else {
        audio.pause();
    }
}

function nextTrack() {
    trackNum < playList.length - 1 ? trackNum++ : trackNum = 0;
    playAudio(trackNum);
}

function prevTrack() {
    trackNum > 0 ? trackNum-- : trackNum = playList.length - 1;
    playAudio(trackNum);
}

playPauseBtn.addEventListener('click', () => {
    playPauseBtn.classList.toggle('pause');
    playPauseBtn.classList.contains('pause') ? isPlay = true : isPlay = false;
    playAudio(trackNum);
});

function setPlayList() {
    playList.forEach(item => {
        let listItem = document.createElement('li');
        let trackTitle = item.title;
        listItem.textContent = trackTitle;
        listItem.classList.add('play-item');
        playerPlayList.append(listItem);
    });
}


window.addEventListener('DOMContentLoaded', setPlayList);
audio.addEventListener('ended', nextTrack);
playNextBtn.addEventListener('click', nextTrack);
playPrevBtn.addEventListener('click', prevTrack);