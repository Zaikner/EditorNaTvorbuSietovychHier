import { DbConnect } from "../DbConnect";
export class Account_db{
    private id:number = 0;
    private name:string = ''
    private password:string = ''
    private avatar:string = ''
    private score:number = 0;

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
                text: 'INSERT INTO "bachelorsThesis"."Account"(name,password,avatar,score) Values($1,$2,$3,$4);',
                values: [this.name,this.password,this.avatar,this.score],
              }
              client
              .query(query)
              .then((res:any) => console.log(res.rows))
              .catch((e:Error) => console.error(e.stack))}

    public update(){
                let client = DbConnect.get()
                    const query = {
                        name: 'update-account',
                        text: 'UPDATE "bachelorsThesis"."Account" SET name = $1 ,password = $2 ,avatar = $3,score = $4 WHERE name = $1;',
                        values: [this.name,this.password,this.avatar,this.score],
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
        return newAcc
    }
}
