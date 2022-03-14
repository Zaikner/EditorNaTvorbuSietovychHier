// import { edit,editor,ctx,reload} from './canvas.js';
// import { io } from "socket.io-client";
// import { Tile } from './Tile.js';
// import { Background } from './Background.js';
// const editorSocket = io();//'https://sietove-hry.herokuapp.com/'
// //socket.emit('chat message', 'hi');
// editorSocket.on('connected',(msg)=>{
//   console.log('Editor client connected')
//   console.log(msg)
//   msg.tiles.forEach((tile:any) =>{
//     let addedTile = new Tile(tile.type,tile.centerX,tile.centerY,tile.x1,tile.x2,tile.y1,tile.y2,tile.radius,tile.color,tile.tileNumber)
//      addedTile.setStroke(tile.stroke)
//      addedTile.setStrokeColor(tile.strokeColor)
//      addedTile.setShape(tile.shape)
//      addedTile.setIsChoosen(tile.isChoosen)
//      console.log('back je :'+msg.background.image)
//      let image = new Image()
//      image.src = msg.background.image
//      image.onload = function(){
//       addedTile.setBackgroundFile(image)
//       reload(editor,ctx)
//      }
//       //addedTile.setBackgroundFile(tile.backgroundFile)
//       //addedTile.setPatternFile(tile.patternFile)
//      addedTile.setIsEnding(tile.isEnding)
//      addedTile.setIsEndingFor(tile.isEndingFor)
//      addedTile.setIsStarting(tile.isStarting)
//      addedTile.setIsStartingFor(tile.isStartingFor)
//      addedTile.setBelongTo(tile.belongTo)
//      addedTile.setCanOccupy(tile.canOccupy)
//      addedTile.setToogleNumber(tile.toggleNumber)
//      addedTile.setNumberingColor(tile.numberingColor)
//      addedTile.setFollowingTileNumber(tile.numberOfFollowingTile)
//     editor.getGame().addTile(addedTile)
//   })
//   let background = new Background()
//   background.setColor(msg.background.color)
//   let backImage = new Image()
//   backImage.src = msg.background.image
//   backImage.onload = function(){
//     background.setBackgroundImage(backImage)
//     editor.getGame().setBackground(background)
//     console.log('obrazok ready')
//     reload(editor,ctx)
//   }
//   background.setBackgroundImage(backImage)
//   console.log(background)
//   console.log('sprava je pod')
//   console.log(msg.background)
//   console.log('farba je: '+msg.background.color)
//   editor.getGame().setBackground(background)
//   //editor.getGame().setBackground(msg.background)
//   editor.getGame().setAuthor(msg.game.author)
//   editor.getGame().setName(msg.game.name)
//   editor.getGame().setNumOfPlayers(msg.game.numOfPlayers)
//   //reload(editor,ctx)
//   //edit()
// })
// //editorSocket.on('connected',()=>{console.log('pripojil Client Editor!')})
// console.log(window.location.href.split('/'))
// let zoz = window.location.href.split('/')
// if (zoz[zoz.length-2] === 'editor'){
//     console.log('spadlo to')
//   edit()
//   console.log('tu to nepadlo')
// }
// else{
//   const params = new URLSearchParams(window.location.search);
//   editorSocket.emit('load game',{id:getCookie('id'),name:params.get('name')})
// }
// editorSocket.on('loaded game',()=>{
//   console.log('Editor client connected')
//   //edit()
// })
// function getCookie(name:string) {
//     let cookie = new Map();
//     document.cookie.split(';').forEach(function(el) {
//       let [k,v] = el.split('=');
//       let key:string = k.trim()
//       cookie.set(key,v);
//     })
//     return cookie.get(name);
//   }
//   export{editorSocket};
