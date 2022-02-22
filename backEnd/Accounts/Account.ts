export class Account{
    private name:string
    private password:string
    private avatar:string = 'default'
    private clientId:string = ''

    constructor(name:string,password:string){
        this.name = name
        this.password = password
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
    public getClientId() : string {
        return this.clientId
    }
    public setClientId(newId:string){
        this.clientId = newId
    }

}