import { DbConnect } from "../DbConnect";
export class Tile_db{
    private id:number= 0;
    private type:string = '';
    private centerX:number = 0;
    private centerY:number = 0;
    private x1:number = 0;
    private x2:number = 0;
    private y1:number = 0;
    private y2:number = 0;
    private radius:number = 0;
    private isOccupied:boolean = false;
    private color:string = "";
    private stroke:number = 0;
    private strokeColor:string ='';
    private shape:string = 'circle'
    private isChoosen:boolean = false;
    private backgroundFile?:string = '';
    private patternFile?:string = '';
    private tileNumber:number = 0;
    private isEnding:boolean = false;
    private isEndingFor:Array<String>=[]
    private isStarting:boolean = false;
    private isStartingFor:Array<String>=[]
    private belongTo:string = '';
    private canOccupy:Array<String> = []
    private toggleNumber:boolean = true;
    private numberingColor:string = 'white'
    private numberOfFollowingTile:number = 0
    private gameName:string = '';

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

    public setIsChoosen(isChosen:boolean){
        this.isChoosen = isChosen
    }
    public getIsChoosen(){
        return this.isChoosen
    }
    public setType(newType:string){
        this.type = newType
    }
    public getType(){
        return this.type
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
    public setIsOccupied(newIsOccupied:boolean){
        this.isOccupied = newIsOccupied
    }
    public getIsOccupied(){
        return this.isOccupied
    }
    public setColor(newColor:string){
        this.color = newColor
    }
    public getColor(){
        return this.color
    }
    public getBackgroundFile(){
        return this.backgroundFile
    }
    public setBackgroundFile(newFile:string){
         this.backgroundFile = newFile
    }
    public getPatternFile(){
        return this.patternFile
    }
    public setPatternFile(newFile:string){
         this.patternFile = newFile
    }
    
    public setIsEnding(is : boolean) {
        this.isEnding = is;
    }
    public getIsEnding(){
        return this.isEnding
    }
    public setIsStarting(is : boolean) {
        this.isStarting = is;
    }
    public getIsStarting(){
        return this.isStarting
    }
    public setBelongTo(newOwner : string) {
        this.belongTo = newOwner;
    }
    public getBelongTo(){
        return this.belongTo
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
    public setCanOccupy(newPlayers:Array<string>){
        this.canOccupy = newPlayers
    }
    public getCanOccupy(){
        return this.canOccupy
    }
    public setToogleNumber(is : boolean) {
        this.toggleNumber = is;
    }
    public getToggleNumber(){
        return this.toggleNumber}
    public setNumberingColor(color : string) {
        this.numberingColor = color;
    }
    public getNumberingColor() {
        return this.numberingColor;
    }
    public getTileNumber(){
        return this.tileNumber
    }
    public setTileNumber(newNumber:number){
        this.tileNumber = newNumber
    }
    public getFollowingTileNumber(){
        return this.numberOfFollowingTile
    }
    public setFollowingTileNumber(newNumber:number){
        this.numberOfFollowingTile = newNumber
    }
      
    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
      
    public getGameName() : string {
        return this.gameName
    }
    public setGameName(newName:string){
        this.gameName  = newName
    }

    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-tile',
                text: 'INSERT INTO "bachelorsThesis"."Tile"(id,type,"centerX","centerY",x1,x2,y1,y2,radius,"isOccupied",color,stroke,"strokeColor",shape,"isChoosen","backgroundFile","patternFile","tileNumber","isEnding","isEndingFor","isStarting","isStartingFor","belongTo","canOccupy","toggleNumber","numberingColor","numberOfFollowingTile","gameName") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28);',
                values: [this.id,this.type,this.centerX,this.centerY,this.x1,this.x2,this.y1,this.y2,this.radius,this.isOccupied,this.color,this.stroke,this.strokeColor,this.shape,this.isChoosen,this.backgroundFile,this.patternFile,this.tileNumber,this.isEnding,this.isEndingFor,this.isStarting,this.isStartingFor,this.belongTo,this.canOccupy,this.toggleNumber,this.numberingColor,this.numberOfFollowingTile,this.gameName],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}

    public static load(data:any){
        let ret = new Tile_db()
        ret.setId(data.id)
        ret.setType(data.type)
        ret.setCenterX(data.centerX)
        ret.setCenterY(data.centerY)
        ret.setX1(data.x1)
        ret.setX2(data.x2)
        ret.setY1(data.y1)
        ret.setY2(data.y2)
        ret.setRadius(data.radius)
        ret.setIsOccupied(data.isOccupied)
        ret.setColor(data.color)
        ret.setStroke(data.stroke)
        ret.setStrokeColor(data.strokeColor)
        ret.setShape(data.shape)
        ret.setIsChoosen(data.isChoosen)
        ret.setBackgroundFile(data.backgroundFile)
        ret.setPatternFile(data.patternFile)
        ret.setTileNumber(data.tileNumber)
        ret.setIsEnding(data.isEnding)
        ret.setIsEndingFor(data.isEndingFor)
        ret.setIsStarting(data.isStarting)
        ret.setIsStartingFor(data.isStartingFor)
        ret.setBelongTo(data.belongTo)
        ret.setCanOccupy(data.canOccupy)
        ret.setToogleNumber(data.toggleNumber)
        ret.setNumberingColor(data.numberingColor)
        ret.setFollowingTileNumber(data.numberOfFollowingTile)
        ret.setGameName(data.gameName)
        return ret
        }
}