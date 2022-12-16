$(document).ready(function () {
    serialTest();
});
function serialTest() {
    if ("serial" in navigator) {
        alert("시리얼 OK");
        console.log("시리얼 OK");
    } else {
        alert("시리얼 Fail");
        console.log("시리얼 지원 안됨");
    }
}