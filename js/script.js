const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); 

const scoreDiv = document.querySelectorAll('.score-value')[0];
const menu = document.querySelectorAll('.menu-screen')[0];
const finalScore = document.querySelector('.final-score > span');
const btnPlay = document.querySelector('.btn-play');
   

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}
const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red},${green},${blue})`;
}

const audio1 = new Audio("assets/audio1.mp3");
const audio2 = new Audio("assets/audio2.mp3");
const audio3 = new Audio("assets/audio3.mp3");
const audio4 = new Audio("assets/audio4.mp3");
const soundback = new Audio("assets/trilha.mp3");



soundback.volume = 0.7;


const size = 30;
const initialPosition = {
    x: 300, y: 300
};




let direction, loopId, score = 0, time = 220;


let snake = [initialPosition];

let food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};


const drawSnake = () => {
    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = food.color;
        }else 
        {
            ctx.fillStyle = '#ffffff75';
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
}
const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1];

    if (direction == 'right'){
        snake.push({x: head.x + size, y: head.y});
    }
    if (direction == 'left'){
        snake.push({x: head.x - size, y: head.y});
    }
    if (direction == 'up'){
        snake.push({x: head.x, y: head.y - size});
    }
    if (direction == 'down'){
        snake.push({x: head.x, y: head.y + size});
    }
    snake.shift();
}
const drawGrid = () => {
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = '#ffffff';

    for (let i = 0; i <= canvas.width ; i += size){
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += size){
        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}
const drawFood = () => {
    ctx.shadowColor = food.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 5;
}
const sound = () => {
    let iSound = randomNumber(0, 2);
    if (iSound == 0){
        audio1.play();
    }else if(iSound == 1){
        audio2.play();
    }else{
        audio3.play();
    }
}
const eatFood = () => {
    const head = snake[snake.length - 1];
    if (head.x == food.x && head.y == food.y){
        sound();    

        snake.unshift({ x: snake[0].x - size, y: snake[0].y - size });
        let x = randomPosition();
        let y = randomPosition();

        while(snake.find((position, index)=> position.x == x && position.y == y)){
            x = randomPosition();
            y = randomPosition();
        }
        
        food.x = x;
        food.y = y;
        food.color = randomColor();

        
        score += snake.length * 1;
        time = (time > 95)? time * (1 - (0.01 * snake.length)): 80;
    }
}
const showScore = () => {
    scoreDiv.innerHTML = score;
}
const gameover = () => {
    
    audio4.volume = 1;
    soundback.volume = 0.2;
    audio4.play();

    
    finalScore.innerText = score;
    menu.style.display = 'flex';
    canvas.style.filter = 'blur(4px)';

    score = 0;
    direction = undefined;
    new gameLoop();
}

const gameRules = () => {
    const head = snake[snake.length -1];
    const neek = snake.length - 2;
    const canvasWidthLimit = canvas.width - size;
    const canvasHeightLimit = canvas.height - size;

    const autoDeep = snake.find((position, index)=>{
        return index < neek && position.x == head.x && position.y == head.y;
    });
    

    const deepWall = () => head.x < 0 || head.x == canvasWidthLimit || head.y < 0 || head.y == canvasHeightLimit;

    if (deepWall() || autoDeep){
        gameover();
    }

}


const gameLoop = ()=> {
    clearInterval(loopId);
    ctx.clearRect(0, 0, 600, 600);

    soundback.play();

    drawGrid();
    moveSnake();
    drawSnake();
    
    drawFood();
    eatFood();
    gameRules();

    showScore();

    loopId = setInterval(()=>{
        gameLoop();
    }, time);
}


btnPlay.addEventListener('click', ()=>{
    scoreDiv.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';

    snake = [initialPosition];
    
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();

    direction = undefined;
    time = 220;
    audio4.volume = 0;
    soundback.volume = 0.7;
    gameLoop();
});

document.addEventListener('keydown', ({key})=>{
    if(key == 'w' && direction != 'down'){
        direction = 'up';
    }

    if(key == 's' && direction != 'up'){
        direction = 'down';
    }

    if(key == 'a' && direction != 'right'){
        direction = 'left';
    }
    
    if(key == 'd' && direction != 'left'){
        direction = 'right';
    }
});

gameLoop();