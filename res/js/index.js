const DEBUG_DISABLE = false;

$(document).ready(function () {
});



let menuOpen = false;
$(document).click(function (e) {
    if (menuOpen) {
        if (!$(e.target).hasClass('SpnMenu')) {
            let menuIcon = $('#menu_icon');
            menuIcon.prop('checked', false);
            menuIcon.change();
        }
    }
});

window.onload = function () {
    $('#menu_icon').change(menuControl);
    setWidget();
}

function setWidget() {
    $('#btnMainAiitkit').on('click', loadPage);

    $('#divMainContents').load('page/aiit.html');
}

function menuControl() {
    menuOpen = $(this).prop('checked');
    debugMessage('Menu Open', menuOpen);
}

function loadPage() {
    debugMessage('Page ID', this.id);
    let mainPage = $('#divMainContents');


}






/**
 * 디버그 출력 포맷
 * @param index 안내
 * @param message 메시지
 */
function debugMessage(index, message) {
    if (DEBUG_DISABLE) {
        return;
    }
    if (message==null) {
        window.console.log("DEBUG[index.js] : %s",index);
        return;
    }
    window.console.log("DEBUG[index.js]-%s : %o",index,message);
}