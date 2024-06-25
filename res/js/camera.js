let port;
let textEncoder;
let writableStreamClosed;
let writer;
let btnSendMsg;
let btnTemp;
let btnPrediction;
let btnModelLoad;

let startDate = new Date();

$(document).ready(function () {
    btnSendMsg = $("#btnSendMsg");
    btnTemp = $("#btnTemp");
    btnPrediction = $("#btnPrediction");
    btnModelLoad = $("#btnModelLoad");

    // btnSendMsg.attr('disabled', true);
    // btnSendMsg.css('visibility', 'hidden');
    // btnTemp.css('visibility', 'hidden');

    $("#btnGetSerial").on('click', serialTest);
    btnModelLoad.on('click', modelLoad);
    btnSendMsg.on('click', writeAiit);

    btnPrediction.on('click', initialize);
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
            btnSendMsg.css('visibility', 'visible');
            // btnModelLoad.attr('disabled', false);
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
    console.log("Connection Check");
    await writer.write("QAT01");
}

function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('.image-upload-wrap').hide();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/J-gOsDHsq/";
// const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;
let modelURL, metadataURL

let colorSet = ["blue", "red", "green", "yellow"];

// Load the image model and setup the webcam
async function modelLoad() {
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

    btnModelLoad.text('Reload Model');
    btnPrediction.css('visibility', 'visible');
}

async function initialize() {
    switch (btnPrediction.text()) {
        case 'Start Prediction':
            $('#webcam-container').children().remove();
            $('#label-container').children().remove();
            btnPrediction.text('Stop Prediction');
            btnPrediction.removeClass('CustomBtn BlueAnim');
            btnPrediction.addClass("CustomBtn CancelAnim");

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
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.childNodes[i].append(document.createElement("div"),document.createElement("div"));
            }
            break;
        case 'Stop Prediction':
            await webcam.stop();
            btnPrediction.text('Start Prediction');
            btnPrediction.removeClass('CustomBtn CancelAnim');
            btnPrediction.addClass("CustomBtn BlueAnim");
            break;
        default:
            break;
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
    let valueList = [];
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].style.height = "50px";
        labelContainer.childNodes[i].style.width = "300px";
        labelContainer.childNodes[i].style.textAlign = "left";
        labelContainer.childNodes[i].style.backgroundColor = "gray";
        labelContainer.childNodes[i].childNodes[0].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].childNodes[0].style.display = "inline-block";
        labelContainer.childNodes[i].childNodes[1].style.height = "10px";
        labelContainer.childNodes[i].childNodes[1].style.width = 200 * prediction[i].probability.toFixed(2)+"px";
        labelContainer.childNodes[i].childNodes[1].style.backgroundColor = colorSet[i];
        labelContainer.childNodes[i].childNodes[1].style.display = "inline-block";
        valueList.push(prediction[i].probability.toFixed(2));

        // labelContainer.childNodes[i].style.backgroundColor = colorSet[i];
    }
    let numList = valueList.map(Number);
    let maxValue = Math.max.apply(null, numList);
    const now = new Date();
    const deltaTime = now.getTime() - startDate.getTime();
    if ((deltaTime) < 600) {
        return;
    }
    for (let i = 0; i < valueList.length; i++) {
        if (numList[i]===maxValue) {
            startDate = new Date();
            await sendSignal(i);
        }
    }
}

let lastMSG = "";
let repeatCheck = 0;
async function sendSignal(colorIndex) {
    let msg = "";
    switch (colorIndex) {
        case 0:
            msg = "camera:0,0,255";
            break;
        case 1:
            msg = "camera:255,0,0";
            break;
        case 2:
            msg = "camera:0,255,0";
            break;
        case 3:
            msg = "camera:255,255,0";
            break;
        default:
            break;
    }

    // if (lastMSG === msg) {
    //     if (repeatCheck < 1) {
    //         repeatCheck++;
    //     } else {
    //         return;
    //     }
    // } else {
    //     repeatCheck = 0;
    // }
    if (lastMSG === msg) {
        return;
    }
    console.log(msg);
    lastMSG = msg;
    if (writer != null) {
        await writer.write(msg);
    } else {
        console.log("AIIT Kit Not Found");
    }

}