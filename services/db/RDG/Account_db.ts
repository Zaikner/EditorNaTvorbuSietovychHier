import { DbConnect } from "../DbConnect";
export class Account_db{
    private id:number = 0;
    private name:string = ''
    private password:string = ''
    private avatar:string = ''
    private score:number = 0;
    private gameWon:number = 0;
    private gameLost:number  =0;

    public getId() : number {
        return this.id
    }
    public setId(newId:number){
        this.id  = newId
    }
    public getScore() : number {
        return this.score
    }
    public setScore(newScore:number){
        this.score  = newScore
    }
    public getGameWon() : number {
        return this.gameWon
    }
    public setGameWon(newScore:number){
        this.gameWon  = newScore
    }
    public getGameLost() : number {
        return this.gameLost
    }
    public setGameLost(newScore:number){
        this.gameLost  = newScore
    }
      
    public getName() : string {
        return this.name
    }
    public setName(newName:string){
        this.name  = newName
    }
    public getPassword() : string {
        return this.password
    }
    public setPassword(newPassword:string){
        this.password  = newPassword
    }
    public getAvatar() : string {
        return this.avatar
    }
    public setAvatar(newAvatar:string){
        this.avatar  = newAvatar
    }

    public insert(){
        let client = DbConnect.get()
            const query = {
                name: 'insert-account',
                text: 'INSERT INTO bachelors_thesis.accounts(name,password,avatar,score,games_won,games_lost) Values($1,$2,$3,$4,$5,$6);',
                values: [this.name,this.password,this.avatar,this.score,this.gameWon,this.gameLost],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}

    public update(){
                let client = DbConnect.get()
                    const query = {
                        name: 'update-account',
                        text: 'UPDATE bachelors_thesis.accounts SET name = $1 ,password = $2 ,avatar = $3,score = $4,games_won = $5, games_lost = $6 WHERE name = $1;',
                        values: [this.name,this.password,this.avatar,this.score,this.gameWon,this.gameLost],
                      }
                      client
                      .query(query)
                      .then((res:any) => console.log(res.rows))
                      .catch((e:Error) => console.error(e.stack))}

    public static load(data:any){
        let newAcc = new Account_db()
        newAcc.setId(data.id)
        newAcc.setName(data.name)
        newAcc.setPassword(data.password)
        newAcc.setScore(data.score)
        newAcc.setAvatar(data.avatar)
        newAcc.setGameWon(data.games_won)
        newAcc.setGameLost(data.games_lost)
        return newAcc
    }
}
