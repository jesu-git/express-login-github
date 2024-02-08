


export class TicketManager {


    static async createTicket(ticket){
      try {

          return await TicketModel.create(ticketM)
        
      } catch (error) {

        console.log("No se pudo crear su ticket")
        
      }
    }
}