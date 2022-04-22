import { DbConnect } from "../DbConnect";
export class BackgroundComponent_db{
    private id:number = 0
    private gameName:string = ''
    private image:string = ''
    private color:string = 'wheat'
    private strokeColor:string = ''
    private stroke:number = 0
    private type:string = '';
    private centerX:number = 0;
    private centerY:number = 0;
    private x1:number = 0;
    private x2:number = 0;
    private y1:number = 0;
    private y2:number = 0;
    private radius:number = 0;
    private imageWidth:number = 0;
    private imageHeigth:number = 0;
    

    public setId(newId:number){
        this.id= newId
    }
    public getId(){
        return this.id
    }
    public setGameName(newName:string){
        this.gameName = newName
    }
    public getGameName(){
        return this.gameName
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
    public setImage(newImage:string){
         this.image = newImage
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
    public setStroke(newStroke:number){
        this.stroke = newStroke
    }
    public getStrokeColor(){
        return this.strokeColor
    }
    public setStrokeColor(newStrokeColor:string){
        this.strokeColor = newStrokeColor
    }
    public getStroke(){
        return this.stroke
    }
    public getImageWidth(){
        return this.imageWidth
    }
    public setImageWidth(newWidth:number){
         this.imageWidth = newWidth
    }
    public getImageHeight(){
        return this.imageHeigth
    }
    public setImageHeight(newHeight:number){
         this.imageHeigth = newHeight
    }


    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-background-component',
                text: 'INSERT INTO "bachelorsThesis"."Background_component"(image,color,"gameName","strokeColor",stroke,type,"centerX","centerY",x1,x2,y1,y2,radius,"imageHeigth","imageWidth") Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);',
                values: [this.image,this.color,this.gameName,this.strokeColor,this.stroke,this.type,this.centerX,this.centerY,this.x1,this.x2,this.y1,this.y2,this.radius,this.imageHeigth,this.imageWidth],

              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}
    
    public static load(data:any){
            let ret = new BackgroundComponent_db()
            ret.setId(data.id)
            ret.setImage(data.image)
            ret.setColor(data.color)
            ret.setType(data.type)
            ret.setCenterX(data.centerX)
            ret.setCenterY(data.centerY)
            ret.setX1(data.x1)
            ret.setX2(data.x2)
            ret.setY1(data.y1)
            ret.setY2(data.y2)
            ret.setRadius(data.radius)
            ret.setGameName(data.gameName)
            ret.setStroke(data.stroke)
            ret.setStrokeColor(data.strokeColor)
          
            ret.setImageWidth(data.imageWidth)
            ret.setImageHeight(data.imageHeigth)
            return ret
            }
}