import { DbConnect } from "../DbConnect";
export class Tile_db{
    private id:number= 0;
    private centerX:number = 0;
    private centerY:number = 0;
    private x1:number = 0;
    private x2:number = 0;
    private y1:number = 0;
    private y2:number = 0;
    private radius:number = 0;
    private color:string = "";
    private stroke:number = 0;
    private strokeColor:string ='';
    private shape:string = 'circle'
    private image?:string = '';
    private tileNumber:number = 0;
    private isEndingFor:Array<String>=[]
    private isStartingFor:Array<String>=[]
    private gameId:number = 0;
    private questionId:number = -1;
    private cantBeEliminatedOnTile:Array<string> = []
    private skip = 0;
    private repeat = 0;
    private forward = 0;
    private backward = 0;
    private mustThrown = 0;
    private nextTilesIds:Array<string> = []
    private randomQuestion:boolean = false;

    public setStroke(newStroke:number){
        this.stroke = newStroke
    }
    public getStroke(){
        return this.stroke
    }
    public setStrokeColor(newStrokeColor:string){
        this.strokeColor = newStrokeColor
    }
    public getStrokeColor(){
        return this.strokeColor
    }
    public setShape(newShape:string){
        this.shape = newShape
    }
    public getShape(){
        return this.shape
    }

    public setX1(newX1:number){
        this.x1 = newX1
    }
    public getX1(){
        return this.x1
    }
    public setX2(newX2:number){
        this.x2 = newX2
    }
    public getX2(){
        return this.x2
    }
    public setY1(newY1:number){
        this.y1 = newY1
    }
    public getY1(){
        return this.y1
    }
    public setY2(newY2:number){
        this.y2 = newY2
    }
    public getY2(){
        return this.y2
    }
    public setCenterX(newCenterX:number){
        this.centerX = newCenterX
    }
    public getCenterX(){
        return this.centerX
    }

    public setCenterY(newCenterY:number){
        this.centerY = newCenterY
    }
    public getCenterY(){
        return this.centerY
    }
    public setRadius(newRadius:number){
        this.radius = newRadius
    }
    public getRadius(){
        return this.radius
    }

    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public getImage(){
        return this.image
    }
    public setImage(newFile:string){
         this.image = newFile
    }
    public setIsEndingFor(newPlayers:Array<string>){
        this.isEndingFor = newPlayers
    }
    public getIsStartingFor(){
        return this.isStartingFor
    }
    public setIsStartingFor(newPlayers:Array<string>){
        this.isStartingFor = newPlayers
    }
    public getIsEndingFor(){
        return this.isEndingFor
    }
  
    public getTileNumber(){
        return this.tileNumber
    }
    public setTileNumber(newNumber:number){
        this.tileNumber = newNumber
    }
      
    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
    public getQuestionId() : number {
        return this.questionId
    }
    public setQuestionId(newID:number){
        this.questionId  = newID
    }
      
    public getGameId() : number {
        return this.gameId
    }
    public setGameId(newId:number){
        this.gameId = newId
    }
    public setCantBeEliminatedOnTile(newPlayers:Array<string>){
        this.cantBeEliminatedOnTile = newPlayers
    }
    public getCantBeEliminatedOnTile():Array<string>{
        return this.cantBeEliminatedOnTile
    }
    public setNextTilesIds(newIds:Array<string>){
        this.nextTilesIds= newIds
    }
    public getNextTilesIds(){
        return this.nextTilesIds
    }
    public getSkip(){
        return this.skip
    }
    public setSkip(newSkip:number){
        this.skip = newSkip
    }
    public getRepeat(){
        return this.repeat
    }
    public setRepeat(newRepeat:number){
        this.repeat = newRepeat
    }
    public getForward(){
        return this.forward
    }
    public setForward(newForward:number){
        this.forward = newForward
    }
    public getBackward(){
        return this.backward
    }
    public setBackward(newBackward:number){
        this.backward = newBackward
    }
    public getMustThrown(){
        return this.mustThrown
    }
    public setMustThrown(newThrown:number){
        this.mustThrown = newThrown
    }

    public setRandomQuestion(is:boolean){
        this.randomQuestion = is
    }
    public getRandomQuestion(){
        return this.randomQuestion
    }

    public insert(){
        let client = DbConnect.get()
          
            const query = {
                name: 'insert-tile',
                text: 'INSERT INTO bachelors_thesis.tiles(id,center_x,center_y,x_1,x_2,y_1,y_2,radius,color,stroke,stroke_color,shape,image,tile_number,is_ending_for,is_starting_for,game_id,question_id,cant_be_eliminated_on_tile,skip,repeat,forward,backward,must_thrown,next_tiles_ids,random_question) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26);',
                values: [this.id,this.centerX,this.centerY,this.x1,this.x2,this.y1,this.y2,this.radius,this.color,this.stroke,this.strokeColor,this.shape,this.image,this.tileNumber,this.isEndingFor,this.isStartingFor,this.gameId,this.questionId,this.cantBeEliminatedOnTile,this.skip,this.repeat,this.forward,this.backward,this.mustThrown,this.nextTilesIds,this.randomQuestion],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}

    

    public static load(data:any){
        let ret = new Tile_db()
        ret.setId(data.id)
        ret.setCenterX(data.center_x)
        ret.setCenterY(data.center_y)
        ret.setX1(data.x_1)
        ret.setX2(data.x_2)
        ret.setY1(data.y_1)
        ret.setY2(data.y_2)
        ret.setRadius(data.radius)
        ret.setColor(data.color)
        ret.setStroke(data.stroke)
        ret.setStrokeColor(data.stroke_color)
        ret.setShape(data.shape)
        ret.setImage(data.image)
        ret.setTileNumber(data.tile_number)
        ret.setIsEndingFor(data.is_ending_for)
        ret.setIsStartingFor(data.is_starting_for)
        ret.setGameId(data.game_id)
        ret.setQuestionId(data.question_id)
        ret.setCantBeEliminatedOnTile(data.cant_be_eliminated_on_tile)
        ret.setSkip(data.skip)
        ret.setRepeat(data.repeat)
        ret.setForward(data.forward)
        ret.setBackward(data.backward)
        ret.setMustThrown(data.must_thrown)
        ret.setNextTilesIds(data.next_tiles_ids)
        ret.setRandomQuestion(data.random_question)
        return ret
        }
}