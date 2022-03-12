const cards = document.querySelectorAll('.memory-card');
const end = document.querySelector('.ending');
const move = document.querySelector('.moves');
const match = document.querySelector('.match');
const totalTime = document.querySelector('.total-time');
const totalMoves = document.querySelector('.total-moves');
const startGame = document.querySelector('.start-game');
const start = document.querySelector('.start');
const again = document.querySelector('.again');
let movesTotal = 0; 
let win = 0;
let hasFlippedCard = false;
let boardLocked = false;
let firstClick, secondClick;

// переворот карточек
const flipCard = event => {
    const target = event.target.parentElement;
    if (boardLocked) return;
    if (target === firstClick) return;

    target.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstClick = target;
    } else {
        hasFlippedCard = false;
        secondClick = target;
        checkForMatch();
        movesTotal ++;
        move.innerHTML = movesTotal;
    }
    if (win === 10) {
        clearInterval(timer);
        end.classList.remove('hidden');
        totalTime.innerHTML = `Total time: ${minutes_str}:${seconds_str}`; 
        totalMoves.innerHTML = `Total moves: ${movesTotal}`;
        addRecord();
    }
}

// сравнение
const checkForMatch = () => {
    if (firstClick.dataset.animals === secondClick.dataset.animals) {
        disableCards();
        win++;
        match.innerHTML = `${win}&nbsp;`;
    } else {
        unflipCards();
    }
}

// стопор карточки
const disableCards = () => {
    firstClick.removeEventListener('click', flipCard);
    secondClick.removeEventListener('click', flipCard);
}

// возвращает
const unflipCards = () => {
    boardLocked = true;
        setTimeout(() => {
            firstClick.classList.remove('flip');
            secondClick.classList.remove('flip');
            resetBoard();
        }, 1000);
}

const resetBoard =  () => {
    hasFlippedCard = boardLocked = false;
    firstClick = secondClick = null;
}

cards.forEach(card => {
    card.addEventListener ('click', flipCard);
// создание рандома, перемешиваем
    const random = Math.floor(Math.random() * cards.length);
    card.style.order = random;
})

// старт
const gameLaunch = (e) => {
    if  (e.target.classList.contains('start')) {
        startGame.classList.add('hidden');
        startWatching(seconds, minutes);
    }
}
start.addEventListener('click', gameLaunch);

// отсчет времени
const time = document.querySelector('.time');
let seconds = 0;
let minutes = 0;
let seconds_str = '';
let minutes_str = '';
let timer;
function startWatching(seconds, minutes) {
	timer = setInterval(() => {
		seconds > 58 ? ((minutes += 1), (seconds = 0)) : (seconds += 1);
		seconds_str = seconds > 9 ? `${seconds}` : `0${seconds}`;
		minutes_str = minutes > 9 ? `${minutes}` : `0${minutes}`;
		time.innerHTML = `${minutes_str}:${seconds_str}`;
    }, 1000);
};

// заново
const againGame = () => {
    window.location.reload();
}    
again.addEventListener('click', againGame);

// рекорды
const recordBtn = document.querySelector('.records');
const recordsList = document.querySelector('.records-list');
const recordTime = document.querySelector('.record-time');
const recordMoves = document.querySelector('.record-moves');
const place = document.querySelector('.place');
 
const addRecord = () => {
    // добавляем в локал ходы
    const lastGameMoves = localStorage.getItem('Moves') ? JSON.parse(localStorage.getItem('Moves')) : [];
    lastGameMoves.push(movesTotal);
    if (lastGameMoves.length > 10) {
        lastGameMoves.shift();
    }
    localStorage.setItem('Moves', JSON.stringify(lastGameMoves));
    let restoredLastMoves = JSON.parse(localStorage.getItem('Moves'));
    console.log(restoredLastMoves);
    // добавляем в локал время 
    const lastGameTime = localStorage.getItem('Time') ? JSON.parse(localStorage.getItem('Time')) : [];
    lastGameTime.push(`${minutes_str}:${seconds_str}`);
    if (lastGameTime.length > 10) {
        lastGameTime.shift();
    }
    localStorage.setItem('Time', JSON.stringify(lastGameTime));
    let restoredLastTime = JSON.parse(localStorage.getItem('Time'));
    console.log(restoredLastTime);

    // делаем таблицу результатов
    let record = "<table align='center'>";
    record += "<tr><th colspan='2' align='center'>Your results:</th></tr>";
    record += "<tr><th>№</th><th>Moves</th><th>Time</th></tr>";
    for (i = 0; i < restoredLastMoves.length; i++) {
        record += "<tr><td>" + (i+1) + " </td>";
        record += "<td>" + restoredLastMoves[i] + "</td>";
        record += "<td>" + restoredLastTime[i] + "</td>";
    }
    record += "</table>";
    dvcontainer = document.querySelector(".result-block");
    dvcontainer.innerHTML = record;
}


