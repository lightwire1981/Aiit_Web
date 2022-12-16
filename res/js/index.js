let port_num;

$(document).ready(function () {
    $("#btnGetSerial").on('click', serialTest);
    $("#btnSendMsg").on('click', writeAiit);
});
async function serialTest() {

    if ("serial" in navigator) {
        console.log("시리얼 OK");
        await navigator.serial.requestPort().then(async (port) => {
            console.log(port);
            port_num = port;
            await port_num.open({baudRate: 9600});
        }).catch((e) => {
            console.log(e);
        });
    } else {
        alert("시리얼 Fail");
        console.log("시리얼 지원 안됨");
    }
}

async function writeAiit() {
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port_num.writable);

    const writer = textEncoder.writable.getWriter();

    await writer.write("QAT01");
}