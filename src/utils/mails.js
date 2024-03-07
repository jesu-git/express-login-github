import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({

    service: "gmail",
    port: 587,
    auth:{

        user: "suarezjesu90@gmail.com",
        pass: "fksk gpqp bmpl uolp"
    }
})


export let sendEmail = async (to,subject,message)=>{

    return await transport.sendMail({

        to,
        subject,
        html: message
    })
}

