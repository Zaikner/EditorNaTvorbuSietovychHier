
import { DbConnect } from "../DbConnect";

export class Texts{
    private id:number = 0;
    private EN:string = '';
    private SK:string = '';

    constructor(){

    }

    
    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
 
    public getEN() : string {
        return this.EN
    }
    public setEN(newEN:string){
        this.EN  = newEN
    }
    public getSK() : string {
        return this.SK
    }
    public setSK(newSK:string){
        this.SK  = newSK
    }
   
       

    public static load(data:any){
                let ret = new Texts()
                ret.setId(data.id)
                ret.setEN(data.en)
                ret.setSK(data.sk)
                return ret
                }
    
}