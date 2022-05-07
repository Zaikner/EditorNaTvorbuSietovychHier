"use strict";
exports.__esModule = true;
exports.spawnNumberInput = exports.spawnMultiSelect = exports.spawnImageInput = exports.spawnSelectMenu = exports.spawnButton = exports.spawnSliderWithValueShower = exports.spawnCheckerWithValueShower = exports.spawnCanvas = exports.spawnTextArea = exports.spawnHeading = exports.spawnLabel = exports.spawnRadioButtons = exports.spawnCheckerWithLabel = exports.spawnButtonWithLabel = exports.spawnParagraph = exports.spawnDiv = exports.spawnColorPicker = void 0;
var canvas_1 = require("./canvas");
var TileEditor_1 = require("./TileEditor");
function spawnColorPicker(doc, parent, id, lbl, func) {
    if (func === void 0) { func = function () { }; }
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    var colorPicker = doc.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = id;
    colorPicker.value = 'white';
    colorPicker.style.float = 'right';
    colorPicker.onchange = function () { func(); };
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(colorPicker);
    return colorPicker;
}
exports.spawnColorPicker = spawnColorPicker;
function spawnParagraph(doc, parent, id, textCont, margin) {
    var text = doc.createElement('p');
    text.textContent = textCont;
    text.id = id;
    doc.getElementById(parent).appendChild(text);
    text.style.color = '#FFFFFF';
    text.style.textAlign = 'left';
    if (margin) {
        text.style.marginTop = "15%";
    }
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
function spawnCheckerWithLabel(doc, parent, id, lbl, isChecked, options) {
    var checker = doc.createElement('input');
    checker.type = 'checkbox';
    checker.id = id;
    checker.checked = isChecked;
    checker.style.float = 'left';
    checker.style.marginTop = '10px';
    var div = spawnDiv(document, parent, 'div' + id, []);
    div.style.display = 'inline-block';
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    label.style.verticalAlign = 'baseline';
    doc.getElementById('div' + id).appendChild(checker);
    doc.getElementById('div' + id).appendChild(label);
    return checker;
}
exports.spawnCheckerWithLabel = spawnCheckerWithLabel;
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
function spawnSliderWithValueShower(doc, parent, id, lbl, min, max, step, value) {
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    var slider = doc.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.value = value;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.style.float = 'right';
    slider.style.width = '50%';
    var sliderShower = doc.createElement('paragraph');
    sliderShower.id = id + 'Shower';
    sliderShower.textContent = value;
    sliderShower.style.float = 'right';
    slider.oninput = function () {
        sliderShower.textContent = slider.value;
    };
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(slider);
    doc.getElementById('div' + id).appendChild(sliderShower);
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
function spawnButtonWithLabel(doc, parent, id, lbl, classList, txt, func) {
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    var button = doc.createElement('button');
    button.id = 'div' + id;
    button.textContent = txt;
    button.style.float = 'right';
    classList.forEach(function (add) {
        button.classList.add(add);
    });
    button.addEventListener('click', function () { func(); });
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(button);
    return button;
}
exports.spawnButtonWithLabel = spawnButtonWithLabel;
function spawnSelectMenu(doc, parent, id, lbl, classList, options) {
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    var menu = doc.createElement('select');
    menu.id = id;
    menu.style.float = 'right';
    classList.forEach(function (add) {
        menu.classList.add(add);
    });
    for (var i = 0; i < options.length; i++) {
        var option = doc.createElement("option");
        option.value = options[i];
        option.text = options[i];
        menu.appendChild(option);
    }
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(menu);
    return menu;
}
exports.spawnSelectMenu = spawnSelectMenu;
function spawnRadioButtons(doc, parent, id, lbl, classList, options, onchangeFunc) {
    var div = spawnDiv(document, parent, 'div' + id, []);
    var divkoMax = document.createElement('div');
    divkoMax.style.float = 'right';
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    div.appendChild(label);
    for (var i = 0; i < options.length; i++) {
        var divko = doc.createElement('div');
        divko.style.float = 'left';
        var option = doc.createElement("input");
        option.type = 'checkbox';
        option.value = options[i];
        option.id = options[i];
        option.style.width = '20px';
        option.style.height = '20px';
        option.style.marginTop = '20px';
        option.style.marginLeft = '3%';
        option.style.float = 'left';
        var checkerShower = doc.createElement('label');
        checkerShower.id = id + 'Shower' + i;
        checkerShower.textContent = options[i];
        checkerShower.htmlFor = option.id;
        checkerShower.style.float = 'left';
        //option.onchange = function(){onchangeFunc()}
        //option.text = options[i];
        divko.append(option);
        divko.append(checkerShower);
        divkoMax.appendChild(divko);
    }
    div.appendChild(divkoMax);
    // doc.getElementById('div'+id)!.appendChild( label);
    //doc.getElementById('div'+id)!.appendChild( menu);
    //return menu
}
exports.spawnRadioButtons = spawnRadioButtons;
function spawnImageInput(doc, parent, id, txt, lbl, func) {
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    var image = doc.createElement('input');
    image.id = id;
    image.type = 'file';
    image.accept = ".jpg, .jpeg, .png";
    image.textContent = txt;
    image.style.float = 'right';
    image.style.width = '50%';
    image.oninput = function () {
        func();
    };
    image.onchange = function () { func(); };
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(image);
    return image;
}
exports.spawnImageInput = spawnImageInput;
function spawnMultiSelect(doc, parent, id, lbl, txt, options, type) {
    spawnDiv(document, parent, 'div' + id, []);
    var label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = lbl;
    label.style.float = 'left';
    label.style.fontSize = 'large';
    label.style.marginRight = '15%';
    var startMenuWrapper = doc.createElement('div');
    startMenuWrapper.id = 'startMenuWrapper';
    startMenuWrapper.classList.add("dropdown");
    //startMenuWrapper.style.marginTop = '10%'
    startMenuWrapper.style.float = 'right';
    //startMenuWrapper.style.float = 'right'
    var startMenuButton = doc.createElement('button');
    startMenuButton.id = 'startMenuButton';
    startMenuButton.textContent = txt;
    startMenuButton.classList.add("btn", "btn-dark", "dropdown-toggle");
    startMenuButton.setAttribute('data-bs-toggle', 'dropdown');
    startMenuButton.style.float = 'right';
    //startMenuButton.style.marginTop = '3%'
    startMenuWrapper.appendChild(startMenuButton);
    document.getElementById('tileEditingPlace').appendChild(startMenuWrapper);
    var startMenuDropdown = doc.createElement('div');
    startMenuDropdown.classList.add("dropdown-menu");
    startMenuDropdown.style.backgroundColor = '#292b2c';
    var types = options;
    var _loop_1 = function (i) {
        var option = doc.createElement("button");
        option.textContent = types[i];
        option.id = types[i] + type;
        option.style.backgroundColor = 'white';
        option.classList.add("dropdown-item", 'btn');
        if (type == 'start' && canvas_1.game.getStartForPlayers().includes(types[i])) {
            option.style.backgroundColor = 'yellow';
        }
        if (type == 'end' && canvas_1.game.getEndForPlayers().includes(types[i])) {
            option.style.backgroundColor = 'yellow';
        }
        if (type == 'enabled' && canvas_1.game.getEnabledForPlayers().includes(types[i])) {
            option.style.backgroundColor = 'yellow';
        }
        if (type == 'immune' && canvas_1.game.getCantBeEliminatedOnTile().includes(types[i])) {
            option.style.backgroundColor = 'yellow';
        }
        option.addEventListener('click', function (e) {
            if (type == 'start') {
                if (i == 0) {
                    if (canvas_1.game.getStartForPlayers().length < canvas_1.game.getPlayerTokens().length) {
                        canvas_1.game.setStartForPlayers(canvas_1.game.getPlayerTokens().slice());
                        canvas_1.game.setStartForPlayers(canvas_1.game.getStartForPlayers().filter(function (t) { return t != 'all'; }));
                        option.style.backgroundColor = 'yellow';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'yellow';
                        }
                    }
                    else {
                        canvas_1.game.setStartForPlayers([]);
                        option.style.backgroundColor = 'white';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'white';
                        }
                    }
                }
                // if (game.getStartForPlayers().includes(types[i])){
                //   game.setStartForPlayers(game.getStartForPlayers().filter((t) => {return t != types[i]}));
                // }
                // else{
                //   game.getStartForPlayers().push(types[i])
                // }
            }
            else if (type == 'end') {
                if (i == 0) {
                    if (canvas_1.game.getEndForPlayers().length < canvas_1.game.getPlayerTokens().length) {
                        canvas_1.game.setEndForPlayers(canvas_1.game.getPlayerTokens().slice());
                        canvas_1.game.setEndForPlayers(canvas_1.game.getEndForPlayers().filter(function (t) { return t != 'all'; }));
                        option.style.backgroundColor = 'yellow';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'yellow';
                        }
                    }
                    else {
                        canvas_1.game.setEndForPlayers([]);
                        option.style.backgroundColor = 'white';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'white';
                        }
                    }
                }
                // if (game.getEndForPlayers().includes(types[i])){
                //   game.setEndForPlayers(game.getEndForPlayers().filter((t) => {return t != types[i]}));
                //   console.log(game.getEndForPlayers())
                // }
                // else{
                //   game.getEndForPlayers().push(types[i])
                //   console.log(game.getEndForPlayers())
                // }
            }
            else if (type == 'enabled') {
                if (canvas_1.game.getEnabledForPlayers().includes(types[i])) {
                    canvas_1.game.setEnabledForPlayers(canvas_1.game.getEnabledForPlayers().filter(function (t) { return t != types[i]; }));
                }
                else {
                    canvas_1.game.getEnabledForPlayers().push(types[i]);
                }
            }
            else if (type == 'immune') {
                if (i == 0) {
                    if (canvas_1.game.getCantBeEliminatedOnTile().length < canvas_1.game.getPlayerTokens().length) {
                        canvas_1.game.setCantBeEliminatedOnTile(canvas_1.game.getPlayerTokens().slice());
                        canvas_1.game.setCantBeEliminatedOnTile(canvas_1.game.getCantBeEliminatedOnTile().filter(function (t) { return t != 'all'; }));
                        option.style.backgroundColor = 'yellow';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'yellow';
                        }
                    }
                    else {
                        canvas_1.game.setCantBeEliminatedOnTile([]);
                        option.style.backgroundColor = 'white';
                        for (var j = 0; j < types.length; j++) {
                            document.getElementById(types[j] + type).style.backgroundColor = 'white';
                        }
                    }
                }
                // if (game.getCantBeEliminatedOnTile().includes(types[i])){
                //   game.setCantBeEliminatedOnTile(game.getCantBeEliminatedOnTile().filter((t) => {return t != types[i]}));
                // }
                // else{
                //   game.getCantBeEliminatedOnTile().push(types[i])
                // }
            }
            if (canvas_1.game.getChoosenTile() != undefined) {
                (0, TileEditor_1.update)();
            }
            e.stopPropagation();
            if (option.style.backgroundColor == 'white' && i != 0) {
                option.style.backgroundColor = 'yellow';
            }
            else if (i != 0) {
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
    doc.getElementById('div' + id).appendChild(label);
    doc.getElementById('div' + id).appendChild(startMenuWrapper);
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
function spawnHeading(doc, parent, id, txt) {
    var heading = doc.createElement('H1');
    heading.id = id;
    heading.classList.add('alignCenter');
    heading.textContent = txt;
    heading.style.color = 'white';
    heading.style.margin = '3%';
    doc.getElementById(parent).appendChild(heading);
    return heading;
}
exports.spawnHeading = spawnHeading;
function spawnTextArea(doc, parent, id, txt, readonly) {
    var textfield = doc.createElement('textarea');
    textfield.id = id;
    textfield.classList.add('ruleField');
    textfield.readOnly = readonly;
    doc.getElementById(parent).appendChild(textfield);
    return textfield;
}
exports.spawnTextArea = spawnTextArea;
function spawnDiv(doc, parent, id, classList) {
    var div = doc.createElement('div');
    div.id = id;
    div.style.float = 'left';
    div.style.width = '100%';
    div.style.marginBottom = '3%';
    classList.forEach(function (c) {
        div.classList.add(c);
    });
    doc.getElementById(parent).appendChild(div);
    return div;
}
exports.spawnDiv = spawnDiv;
function spawnLabel(doc, labelFor, txt) {
    var label = doc.createElement('label');
    label.htmlFor = labelFor;
    label.textContent = txt;
    label.style.color = 'white';
    return label;
}
exports.spawnLabel = spawnLabel;
