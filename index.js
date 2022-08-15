import i18next from 'https://deno.land/x/i18next/index.js';
import { translations } from './lang.js';
import playList from './assets/sounds/playList.js';


await i18next.init({
    lng: 'en',
    debug: true,
    resources: translations
});

///переделать
console.log(i18next.t('GoodNight'));
////////
const greetingTranslation = {
    'en': ["Good night", "Good morning", "Good afternoon", " Good evening"],
    'ru': ["Доброй ночи", "Доброе утро", "Добрый день", "Добрый вечер"],
};

let randomNum;
let lang = 'en';


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
    showGreeting(lang);
}

const showDate = () => {
    const displayedDate = document.querySelector('.date');
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: '2-digit' };
    const currentDate = lang === 'en' ? date.toLocaleDateString('en-US', options) : date.toLocaleDateString('ru-RU', options);
    displayedDate.textContent = currentDate;
}

const showGreeting = (lang = 'en') => {
    const greeting = document.querySelector('.greeting');
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours);
    const greetingText = greetingTranslation[lang][Math.floor(hours / 6)];
    // const greetingText = `Good ${timeOfDay}`
    greeting.textContent = greetingText;
}

const getTimeOfDay = hours => {
    const timesOfDay = ['night', 'morning', 'afternoon', 'evening'];

    return timesOfDay[Math.floor(hours / 6)];
}

const getRandomNum = (bg = 20) => {
    if (bg != 20) {
        return Math.floor(Math.random() * bg);
    }
    randomNum = Math.floor(Math.random() * 20) + 1;
}

showTime();
showGreeting(lang);

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


let bgSourse; //background sourse variable  при сохранении в local storage присваивать значение при загрузке страницы
const setBg = (bgSourse = 'gh') => {
    const body = document.body;

    if (bgSourse === 'gh') {
        const date = new Date();
        const hours = date.getHours(); //продублировано
        const timeOfDay = getTimeOfDay(hours);
        let bgNum;
        randomNum < 10 ? bgNum = "0" + randomNum : bgNum = randomNum.toString();
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
        // img.src = `https://github.com/TretyakovAndrew/momentum/tree/assets/images/${timeOfDay}/${bgNum}.jpg`;
        img.addEventListener('load', () => {
            body.style.backgroundImage = `url(${img.src})`;
        })
    } else if (bgSourse === 'unsplash') {
        async function getLinkToImage() {
            const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=x2YMzrlnDSwCb4_nXWaF8RUyPrNgomPLsyrsrr-RO3c';
            const res = await fetch(url);
            const data = await res.json();
            // console.log(data.urls.regular)
            return data.urls.regular;
        }
    }
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

async function getWeather(lang = 'en') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=89274f8372c411e6c202134024e9c1a5&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    setCityLocalStorage();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = lang === 'en' ? `Wind speed: ${Math.floor(data.wind.speed)} m/s` : `Скорость ветра: ${Math.floor(data.wind.speed)} м/с`;
    humidity.textContent = lang === 'en' ? `Humidity: ${data.main.humidity.toFixed(0)}%` : `Влажность: ${data.main.humidity.toFixed(0)}%`;
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather(lang);
        city.blur();
    }
    getWeather(lang);
}

function setCityLocalStorage() {
    localStorage.setItem('city', city.value);
}

document.addEventListener('DOMContentLoaded', getWeather(lang));
city.addEventListener('keypress', setCity);
city.addEventListener('change', setCity);



//quotes
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const quoteSwitchBtn = document.querySelector('.change-quote');

async function getQuotes() {
    const quotes = 'quotes.json';
    const res = await fetch(quotes);
    const data = await res.json();
    const quoteNum = getRandomNum(data.length - 1);
    quote.textContent = data[quoteNum][`${lang}`][0];
    author.textContent = data[quoteNum][`${lang}`][1];
}
getQuotes();

quoteSwitchBtn.addEventListener('click', getQuotes);

//player
const audio = new Audio();
const playPauseBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const playerPlayList = document.querySelector('.play-list');
const progressBar = document.querySelector('.progress-bar');
const trackCurrentTime = document.querySelector('.current-time');
const currentTrackTitle = document.querySelector('.track-title');
const trackTiming = document.querySelector('.track-timing');
const muteBtn = document.querySelector('.muteBtn');
const soundVolume = document.querySelector('.sound-volume');
let trackNum = 0;
let isPlay = false;
let isSoundOn = true;
let audioPlay;

function playAudio(trackNum) {
    const allTracks = document.querySelectorAll('.play-item');

    allTracks.forEach(element => {
        element.classList.remove('item-active');
    });
    allTracks[trackNum].classList.add('item-active');
    if (isPlay === true) {
        audio.src = playList[trackNum].src;
        audio.currentTime = 0;
        audio.play();
        currentTrackTitle.textContent = `${playList[trackNum].title}`;
        audioPlay = setInterval(function () {
            let audioTime = Math.round(audio.currentTime);
            let audioLength = Math.round(audio.duration);
            trackCurrentTime.style.width = (audioTime * 100) / audioLength + '%';
            trackTiming.textContent = (`${getTimeCodeFromNum(audioTime)} / ${getTimeCodeFromNum(audioLength)}`);
        }, 10);
    } else {
        audio.pause();
        clearInterval(audioPlay);
    }
}

function nextTrack() {
    trackNum < playList.length - 1 ? trackNum++ : trackNum = 0;
    playAudio(trackNum);
    currentTrackTitle.textContent = `${playList[trackNum].title}`;
}

function prevTrack() {
    trackNum > 0 ? trackNum-- : trackNum = playList.length - 1;
    playAudio(trackNum);
    currentTrackTitle.textContent = `${playList[trackNum].title}`;
}

playPauseBtn.addEventListener('click', () => {
    playPauseBtn.classList.toggle('pause');
    playPauseBtn.classList.contains('pause') ? isPlay = true : isPlay = false;
    playAudio(trackNum);
});

function setPlayList() {
    playList.forEach((item, index) => {
        let listItem = document.createElement('li');
        let trackTitle = item.title;
        let trackPlayBtn = document.createElement('div');
        trackPlayBtn.classList.add('track-play');
        trackPlayBtn.style.backgroundImage = `url(../assets/svg/track-play-btn.svg)`;
        listItem.textContent = `${trackTitle}`;
        listItem.classList.add('play-item');
        listItem.id = index;
        listItem.append(trackPlayBtn);
        playerPlayList.append(listItem);
    });
    document.querySelector('.play-item').classList.add('item-active');
    audio.volume = 0.6;
}

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}

function muteSound() {
    soundVolume.classList.toggle('mute-soundbar');
    if (isSoundOn) {
        audio.muted = true;
        muteBtn.style.backgroundImage = 'url(../assets/svg/mute.svg)';
        isSoundOn = false;
    } else {
        audio.muted = false;
        muteBtn.style.backgroundImage = 'url(../assets/svg/unmute.svg)';
        isSoundOn = true;
    }
}

window.addEventListener('DOMContentLoaded', setPlayList);
audio.addEventListener('ended', nextTrack);
playNextBtn.addEventListener('click', nextTrack);
playPrevBtn.addEventListener('click', prevTrack);
muteBtn.addEventListener('click', muteSound);
progressBar.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(progressBar).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
}, false);

const volumeBar = document.querySelector(".volume");
volumeBar.addEventListener('click', e => {
    const barWidth = window.getComputedStyle(volumeBar).width;
    const newVolume = e.offsetX / parseInt(barWidth);
    audio.volume = newVolume;
    soundVolume.style.width = newVolume * 100 + '%';
}, false);

playerPlayList.onclick = function (event) {
    let target = event.target;
    trackNum = target.id;
    playAudio(trackNum);
    isPlay = true;
}

const appLang = document.querySelector('.lang');
appLang.addEventListener('click', () => {
    lang === 'en' ? lang = 'ru' : lang = 'en';
    getQuotes();
    getWeather(lang);
})

//images API
// async function getLinkToImage() {
//     const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=x2YMzrlnDSwCb4_nXWaF8RUyPrNgomPLsyrsrr-RO3c';
//     const res = await fetch(url); //then 
//     const data = await res.json();
//     // console.log(data.urls.regular)
//     return data.urls.regular;
// }

// const imh = await getLinkToImage();
// console.log(imh);                                                                                                     
// document.getElementById('pic').src = imh;