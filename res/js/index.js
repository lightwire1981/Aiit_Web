let port;
let textEncoder;
let writableStreamClosed;
let writer;

$(document).ready(function () {
    $("#btnGetSerial").on('click', serialTest);
    $("#btnSendMsg").on('click', writeAiit);
    $("#btnModelLoad").on('click', init);
});
async function serialTest() {

    if ("serial" in navigator) {
        console.log("USB Serial OK");
        await navigator.serial.requestPort().then(async (result) => {

            port = result;
            await port.open({baudRate: 9600}).then(()=>{
                readyToWrite();
            });
            console.log(port);
        }).catch((e) => {
            console.log(e);
        });
    } else {
        alert("USB Serial 통신 실패");
        console.log("USB Serial Failed");
    }
}

function readyToWrite() {
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
}

async function writeAiit() {

    await writer.write("QAT01");
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/J-gOsDHsq/";
// const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;
let modelURL, metadataURL

// Load the image model and setup the webcam
async function init() {
    let txtUrl = $("#txtModelUrl");
    if (txtUrl.val().length > 0) {
        let user_url = txtUrl.val();
        modelURL = user_url + "model.json";
        metadataURL = user_url + "metadata.json";
    } else {
        modelURL = URL + "model.json";
        metadataURL = URL + "metadata.json";
    }

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }
}