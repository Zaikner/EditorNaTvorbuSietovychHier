"use strict";
exports.__esModule = true;
exports.getCookie = exports.getDataUrlFromImage = void 0;
function getDataUrlFromImage(img) {
    // Create canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}
exports.getDataUrlFromImage = getDataUrlFromImage;
function getCookie(name) {
    var cookie = new Map();
    document.cookie.split(';').forEach(function (el) {
        var _a = el.split('='), k = _a[0], v = _a[1];
        var key = k.trim();
        cookie.set(key, v);
    });
    return cookie.get(name);
}
exports.getCookie = getCookie;
