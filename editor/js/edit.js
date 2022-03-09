import { editBackground } from "./BackgroundEditor";
import { deleteTiles, editTiles, insertTilesMenu, moveTiles } from "./TileEditor";

document.getElementById('editBackground').addEventListener('click',function(){editBackground();} );
document.getElementById('insertTiles').addEventListener('click',function(){insertTilesMenu();} );
document.getElementById('moveTiles').addEventListener('click',function(){moveTiles();} );
document.getElementById('editTiles').addEventListener('click',function(){editTiles();} );
document.getElementById('deleteTiles').addEventListener('click',function(){deleteTiles();} );

export {}