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
    let frequencylevel;
    let oscillate = Math.sin(audio1.currentTime/2) + 1;
        let oscillateinv = -1*Math.sin((audio1.currentTime+2)/2) + 1;

    for (let i = bufferLength; i >= 0; i-=2) {
        
        frequencylevel = dataArray[i] * 3;
        const red = oscillateinv*(1 - i/size)  * 256 ;
        const green =i/size *  256;
        const blue =  oscillate*128;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, canvas.height - frequencylevel, barWidth, frequencylevel); // this will continue moving from left to right
        x += barWidth; // increases the x value by the width of the bar
    }
        for (let i = 0; i < bufferLength; i+=2) {
            
            frequencylevel = dataArray[i] * 3;
            const red =  oscillateinv*(1 - i/size)  * 256 ;
            const green =i/size *  256;
            const blue = oscillate*128;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height - frequencylevel, barWidth, frequencylevel); // this will continue moving from left to right
            x += barWidth; // increases the x value by the width of the bar
        }

        
        




}function preset2({
    bufferLength,
    dataArray,
    barWidth,
    size
}){
    let frequencylevel;

        for (let i = 0; i < bufferLength; i++) {
            frequencylevel = dataArray[i] *2;
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height -frequencylevel, barWidth, 20); // this will continue moving from left to right
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
    let frequencylevel;

        for (let i = 0; i < bufferLength; i++) {
            frequencylevel = dataArray[i]*2;
            const red =  i/size * 256 ;
            const green =  256;
            const blue =  (1 - i/size) * 256;
            ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height-frequencylevel, frequencylevel, 0, 2 * Math.PI);
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
    let frequencylevel;

        for (let i = 0; i < bufferLength; i++) {
            frequencylevel = dataArray[i]*3.5;
            const red = frequencylevel/canvas.height * 256 ;
            const green = frequencylevel/canvas.height * 128;
            const blue = (1- frequencylevel/canvas.height) *  256;
            ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            ctx.moveTo(canvas.width/2,canvas.height -frequencylevel);
            ctx.lineTo(0 + frequencylevel,canvas.height);
            ctx.lineTo(canvas.width - frequencylevel, canvas.height);
            ctx.lineTo(canvas.width/2,canvas.height -frequencylevel);

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
let audioSourceUser = null;
let audioSource = null;
let analyser = null;
let gain = null;

analyser = audioCtx.createAnalyser();


gain = audioCtx.createGain();
analyser.connect(gain);
gain.gain.value = 0;
gain.connect(audioCtx.destination);


let presetN = 1;

let x = 0;



const playButtonE = document.getElementById("Play");


function pausePlayback(){
  
    
    playButtonE.classList.remove("fa-pause")
        playButtonE.classList.add("fa-play")
    playButtonE.dataset.state = 1;
    audio1.pause()
}
function playbutton(){
    
    if (playButtonE.dataset.state == "0"){
        pausePlayback();

        console.log("playButtonE.dataset.state")
    }else if (playButtonE.dataset.state == "1") {
        
        if (micButtonE.dataset.state == "1"){
            micButton();
        }


        audioCtx.resume()
        audio1.play()
        playButtonE.classList.remove("fa-play")
    playButtonE.classList.add("fa-pause")

        

        try{
        audioSource = audioCtx.createMediaElementSource(audio1);
        }catch(DOMexception){
        }
        audioSource.connect(analyser);


        gain.gain.value = 1;
        playButtonE.dataset.state = 0;
    }

    
 

    createvisualizer();
}

const micButtonE = document.getElementById("Mic");

let micState = false;
async function micButton(){
    if (micButtonE.dataset.state == "0"){
    
    let userMicStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      
      
      pausePlayback();
    
      

      
      audioCtx.resume()

      audioSourceUser = audioCtx.createMediaStreamSource(userMicStream);
      audioSourceUser.connect(analyser);
      micButtonE.dataset.state = "1";

    }else{
        micButtonE.dataset.state = "0";
        audioSourceUser.disconnect();

    }
    micButtonE.classList.toggle("fa-microphone-slash")
      micButtonE.classList.toggle("fa-microphone")
      createvisualizer();

}

function createvisualizer(){
    
    analyser.fftSize = 2048;
    const size = analyser.fftSize;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;

    const EplayedBar = document.getElementById("played-bar")


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
}


function choosePreset(number){
    presetN = number;
}



