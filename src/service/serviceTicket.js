import { TicketManager } from "../dao/class/managerTicket";


export class ServiceTicket{


    static async createTicket (ticket){

        return TicketManager.createTicket(ticket)


    }
}