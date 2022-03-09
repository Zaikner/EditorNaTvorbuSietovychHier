import { reload,resize } from "../editor/js/canvas";
import { GameEditor } from "../editor/js/GameEditor";


var doc = document;
const canvas = document.createElement('canvas');
const editor = new GameEditor()

document.getElementById("canvasPlace")!.appendChild(canvas);
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
resize(editor,ctx);

 
window.addEventListener('resize', function(){resize(editor,ctx)});

