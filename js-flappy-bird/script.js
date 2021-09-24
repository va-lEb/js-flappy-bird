const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = './media/flappy-bird-set.png';

let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

const pipeWidht = 78;
const pipeGap = 278;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidht)) - pipeWidht)) + pipeWidht;

let index = 0,
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidht)), pipeLoc()]);
    console.log(pipes);
}

const render = () => {
    index++;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    } else {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flight += gravity;
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
        ctx.fillText('Cliquez pour jouer', 48, 535);
        ctx.font = "bold 30px courier";
    }
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed;
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidht, pipe[1], pipe[0], 0, pipeWidht, pipe[1]);
            ctx.drawImage(img, 432 + pipeWidht, 108, pipeWidht, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidht, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWidht) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidht, pipeLoc()]];
            }
            if ([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidht >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)) {
                gamePlaying = false;
                setup();
            }
        })
    }
    document.getElementById('bestScore').innerHTML = `Meilleur = ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel = ${currentScore}`;
    window.requestAnimationFrame(render);
}
setup();
img.onload = render;
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
