"use strict";
exports.__esModule = true;
exports.spawnNumberInput = exports.spawnMultiSelect = exports.spawnImageInput = exports.spawnSelectMenu = exports.spawnButton = exports.spawnSliderWithValueShower = exports.spawnCheckerWithValueShower = exports.spawnCanvas = exports.spawnParagraph = exports.spawnColorPicker = void 0;
var canvas_1 = require("./canvas");
function spawnColorPicker(doc, parent, id) {
    var colorPicker = doc.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = id;
    colorPicker.value = 'white';
    doc.getElementById(parent).appendChild(colorPicker);
    return colorPicker;
}
exports.spawnColorPicker = spawnColorPicker;
function spawnParagraph(doc, parent, id, textCont) {
    var text = doc.createElement('p');
    text.textContent = textCont;
    doc.getElementById(parent).appendChild(text);
    return text;
}
exports.spawnParagraph = spawnParagraph;
function spawnCanvas(doc, parent, id) {
    var canvas = doc.createElement('canvas');
    canvas.id = id;
    doc.getElementById(parent).appendChild(canvas);
    return canvas;
}
exports.spawnCanvas = spawnCanvas;
function spawnCheckerWithValueShower(doc, parent, id, isChecked, options) {
    var checker = doc.createElement('input');
    checker.type = 'checkbox';
    checker.id = id;
    var checkerShower = doc.createElement('paragraph');
    checkerShower.id = id + 'Shower';
    checkerShower.textContent = options[0];
    checker.oninput = function () {
        if (checker.checked) {
            checkerShower.textContent = options[1];
        }
        else {
            checkerShower.textContent = options[0];
        }
    };
    doc.getElementById(parent).appendChild(checker);
    doc.getElementById(parent).appendChild(checkerShower);
    return checker;
}
exports.spawnCheckerWithValueShower = spawnCheckerWithValueShower;
function spawnSliderWithValueShower(doc, parent, id, min, max, step, value) {
    var slider = doc.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.value = value;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    var sliderShower = doc.createElement('paragraph');
    sliderShower.id = id + 'Shower';
    sliderShower.textContent = value;
    slider.oninput = function () {
        sliderShower.textContent = slider.value;
    };
    doc.getElementById(parent).appendChild(slider);
    doc.getElementById(parent).appendChild(sliderShower);
    return slider;
}
exports.spawnSliderWithValueShower = spawnSliderWithValueShower;
function spawnButton(doc, parent, id, classList, txt, func) {
    var button = doc.createElement('button');
    button.id = id;
    button.textContent = txt;
    classList.forEach(function (add) {
        button.classList.add(add);
    });
    button.addEventListener('click', function () { func(); });
    doc.getElementById(parent).appendChild(button);
    return button;
}
exports.spawnButton = spawnButton;
function spawnSelectMenu(doc, parent, id, classList, options) {
    var menu = doc.createElement('select');
    menu.id = id;
    classList.forEach(function (add) {
        menu.classList.add(add);
    });
    for (var i = 0; i < options.length; i++) {
        var option = doc.createElement("option");
        option.value = options[i];
        option.text = options[i];
        menu.appendChild(option);
    }
    doc.getElementById(parent).appendChild(menu);
    return menu;
}
exports.spawnSelectMenu = spawnSelectMenu;
function spawnImageInput(doc, parent, id, txt, func) {
    var image = doc.createElement('input');
    image.id = id;
    image.type = 'file';
    image.accept = ".jpg, .jpeg, .png";
    image.textContent = txt;
    image.oninput = function () {
        func();
    };
    doc.getElementById(parent).appendChild(image);
}
exports.spawnImageInput = spawnImageInput;
function spawnMultiSelect(doc, parent, id, options, type) {
    var startMenuWrapper = doc.createElement('div');
    startMenuWrapper.id = 'startMenuWrapper';
    startMenuWrapper.classList.add("dropdown");
    var startMenuButton = doc.createElement('button');
    startMenuButton.id = 'startMenuButton';
    startMenuButton.textContent = 'Choose!';
    startMenuButton.classList.add("btn", "btn-dark", "dropdown-toggle");
    startMenuButton.setAttribute('data-bs-toggle', 'dropdown');
    startMenuWrapper.appendChild(startMenuButton);
    document.getElementById('tileEditingPlace').appendChild(startMenuWrapper);
    var startMenuDropdown = doc.createElement('div');
    startMenuDropdown.classList.add("dropdown-menu");
    startMenuDropdown.style.backgroundColor = '#292b2c';
    var types = options;
    var _loop_1 = function (i) {
        var option = doc.createElement("button");
        option.textContent = types[i];
        option.id = types[i];
        option.style.backgroundColor = 'white';
        option.classList.add("dropdown-item", 'btn');
        option.addEventListener('click', function (e) {
            if (type == 'start') {
                if (canvas_1.editor.getStartForPlayers().includes(types[i])) {
                    canvas_1.editor.setStartForPlayers(canvas_1.editor.getStartForPlayers().filter(function (t) { return t != types[i]; }));
                }
                else {
                    canvas_1.editor.getStartForPlayers().push(types[i]);
                }
            }
            else if (type == 'end') {
                if (canvas_1.editor.getEndForPlayers().includes(types[i])) {
                    canvas_1.editor.setEndForPlayers(canvas_1.editor.getEndForPlayers().filter(function (t) { return t != types[i]; }));
                }
                else {
                    canvas_1.editor.getEndForPlayers().push(types[i]);
                }
            }
            else if (type == 'enabled') {
                if (canvas_1.editor.getEnabledForPlayers().includes(types[i])) {
                    canvas_1.editor.setEnabledForPlayers(canvas_1.editor.getEnabledForPlayers().filter(function (t) { return t != types[i]; }));
                }
                else {
                    canvas_1.editor.getEnabledForPlayers().push(types[i]);
                }
            }
            console.log(canvas_1.editor.getStartForPlayers());
            e.stopPropagation();
            if (option.style.backgroundColor == 'white') {
                option.style.backgroundColor = 'yellow';
            }
            else {
                option.style.backgroundColor = 'white';
            }
            e.stopPropagation();
        });
        startMenuDropdown.appendChild(option);
    };
    for (var i = 0; i < types.length; i++) {
        _loop_1(i);
    }
    startMenuWrapper.appendChild(startMenuDropdown);
}
exports.spawnMultiSelect = spawnMultiSelect;
function spawnNumberInput(doc, parent, id) {
    var numberSetter = doc.createElement('input');
    numberSetter.id = id;
    numberSetter.type = 'number';
    doc.getElementById(parent).appendChild(numberSetter);
    return numberSetter;
}
exports.spawnNumberInput = spawnNumberInput;
