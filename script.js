const drawVisualizer = ({
    bufferLength,
    dataArray,
    barWidth,
    size,
    presetN
}) => {
    let args = {bufferLength,
        dataArray,
        barWidth,
        size}
        
        switch(presetN){
            case 1 :
                preset1(args)
                break;
            case 2 :
                preset2(args)
                break;
            case 3 :
                preset3(args)
                break;
            case 4 :
                preset4(args)
                break;
            default:
                preset1(args)
            
        }
        
};

function preset1({
    bufferLength,
    dataArray,
    barWidth,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 3;
            const red =  (1 - i/size)  * 256 ;
            const green =i/size *  256;
            const blue =  256;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // this will continue moving from left to right
            x += barWidth; // increases the x value by the width of the bar
        }

}function preset2({
    bufferLength,
    dataArray,
    barWidth,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] *2;
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height -barHeight, barWidth, 20); // this will continue moving from left to right
            x += barWidth; // increases the x value by the width of the bar
        }

}

function preset3({
    bufferLength,
    dataArray,
    barWidth,
    amplitude,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]*2;
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height-barHeight, barHeight, 0, 2 * Math.PI);
            ctx.stroke();
        }

}

function preset4({
    bufferLength,
    dataArray,
    barWidth,
    amplitude,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]*3.5;
            const red = barHeight/canvas.height * 256 ;
            const green = barHeight/canvas.height * 128;
            const blue = (1- barHeight/canvas.height) *  256;
            ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            ctx.moveTo(canvas.width/2,canvas.height -barHeight);
            ctx.lineTo(0 + barHeight,canvas.height);
            ctx.lineTo(canvas.width - barHeight, canvas.height);
            ctx.lineTo(canvas.width/2,canvas.height -barHeight);

            ctx.stroke()
        }

}



let audio1 = new Audio();
audio1.src = "./08-13-2023 a.k.a Lost Worlds mastered.wav";


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

analyser.fftSize = 512;
const size = analyser.fftSize;

let presetN = 4;


const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength;

const EplayedBar = document.getElementById("played-bar")

let x = 0;
function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    
    drawVisualizer({
        bufferLength,
        dataArray,
        barWidth,
        size,
        presetN
    });

    EplayedBar.setAttribute("style",`width: ${audio1.currentTime/audio1.duration *100}%`)
    


    requestAnimationFrame(animate);
}

animate();




function playbutton(){
    audioCtx.resume()
    audio1.play()
}

function choosePreset(number){
    presetN = number;
}