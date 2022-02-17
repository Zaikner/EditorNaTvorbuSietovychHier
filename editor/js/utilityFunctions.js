"use strict";
exports.__esModule = true;
exports.getDataUrlFromImage = void 0;
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
