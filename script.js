const drawVisualizer = ({
    bufferLength,
    dataArray,
    barWidth,
    amplitude,
    size
}) => {
    let barHeight;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * amplitude;
        const red =  i/size * 256 ;
        const green = 256;
        const blue = (1 - i/size) * 256;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // this will continue moving from left to right
        x += barWidth; // increases the x value by the width of the bar
    }
};


let audio1 = new Audio();
audio1.src = "./Porter_Robinson_Shelter.mp3";


const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyser = null;


audioSource = audioCtx.createMediaElementSource(audio1);
analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 8192;
const size = analyser.fftSize;
const amplitude = 3.5;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength;

let x = 0;
function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer({
        bufferLength,
        dataArray,
        barWidth,
        amplitude,
        size
    });

    console.log(audio1.duration)

    requestAnimationFrame(animate);
}

animate();




function playbutton(){

    audioCtx.resume()
    audio1.play()

    }

