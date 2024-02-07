let port_num;
let textEncoder;
let writableStreamClosed;
let writer;

$(document).ready(function () {
    $("#btnGetSerial").on('click', serialTest);
    $("#btnSendMsg").on('click', writeAiit);
    $("#btnTemp").on('click', testFunc);
});
async function serialTest() {

    if ("serial" in navigator) {
        console.log("시리얼 OK");
        await navigator.serial.requestPort().then(async (port) => {
            console.log(port);
            port_num = port;
            await port_num.open({baudRate: 9600}).then(()=>{
                readyToWrite();
            });
        }).catch((e) => {
            console.log(e);
        });
    } else {
        alert("시리얼 인식 실패");
        console.log("시리얼 지원 안됨");
    }
}

function readyToWrite() {
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port_num.writable);
    writer = textEncoder.writable.getWriter();
}

async function writeAiit() {

    await writer.write("QAT01");
}

async function testFunc() {
    await writer.write("predict");
}