const nodeMailer = require('nodemailer')

class Mailservice{

    constructor(){
        this.transporter = nodeMailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to , link){
        try{
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `activation on ${process.env.API_URL}`,
                text: '',
                html:`
                    <div>
                        <h1> click link to activate account </h1>
                        <a href = "${link}">${link}</a>
                    </div>
                `
            })
        }catch(e){
            console.log(e)
        }
        
    }
}
module.exports = new Mailservice()