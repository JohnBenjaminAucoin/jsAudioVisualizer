const drawVisualizer = ({
    bufferLength,
    dataArray,
    barWidth,
    amplitude,
    size,
    presetN
}) => {
    let args = {bufferLength,
        dataArray,
        barWidth,
        amplitude,
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
                
            
        }
        
};

function preset1({
    bufferLength,
    dataArray,
    barWidth,
    amplitude,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * amplitude;
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
    amplitude,
    size
}){
    let barHeight;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * amplitude;
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
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
            barHeight = dataArray[i];
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, barHeight, 0, 2 * Math.PI);
            ctx.stroke();
        }

}



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

analyser.fftSize = 256;
const size = analyser.fftSize;
const amplitude = 3.5;
let presetN = 1;


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
        amplitude,
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