import { read } from "fs";
import { editorSocket } from "./canvas";


// editorSocket.emit('load texts')

// editorSocket.on('loaded texts',(msg:{texts:Array<{id:number,EN:string,SK:string}>})=>{
// console.log(msg)

// msg.texts.forEach((text:{id:number,EN:string,SK:string}) => {
//     texts.set(text.id,{EN:text.EN,SK:text.SK})
// });
// console.log(texts)
// })


function loadTexts(){
    console.log('aspon zapol loader')
    let file = new File([],"texts.txt")
   
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt!.target!.result);
      console.log(evt)
      console.log()
    };
    reader.readAsText(file);}
loadTexts()
let texts:Map<number,{EN:string,SK:string}> = new Map()

export{loadTexts}