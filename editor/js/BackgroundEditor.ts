import {ctx, game,reload} from './Canvas.js'
import { texts } from './ClientSocket.js'
import {spawnColorPicker, spawnHeading, spawnImageInput} from './Elements.js'
import {removeAllButtons,removeAllListenersAdded} from './TileEditor.js'


var background:HTMLImageElement = undefined!
function editBackground(){
    removeAllButtons()
    removeAllListenersAdded()

    spawnHeading(document,'buttonPlace','',texts[233])
   
    spawnImageInput(document,'tileEditingPlace','backgroundImage','', texts[91],function(){
      let backgroundImage:HTMLInputElement =<HTMLInputElement> document.getElementById('backgroundImage')
      if (backgroundImage.files!.length > 0){
        background = new Image()
        background!.src =URL.createObjectURL(backgroundImage!.files![0]!)
        background.onload = function(){
          game.getBackground().setBackgroundImage(background)
         reload(ctx)
        }}})
 
  let coloPicker = spawnColorPicker(document,'tileEditingPlace','colorPicker',texts[95],function(){
    game.getBackground().setColor((<HTMLInputElement>document.getElementById('colorPicker')).value)
    game.getBackground().setBackgroundImage(undefined!)
   reload(ctx)
})
  coloPicker.value = game.getBackground().getColor()
 }

export {editBackground}