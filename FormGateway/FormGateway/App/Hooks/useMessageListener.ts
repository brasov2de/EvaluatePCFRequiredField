import {  useEffect } from "react";
import { IMessageContent } from "../FormGatewayApp";


interface IMessge{
    origin : string;
    source : any;
    data : IMessageContent;
}

debugger;

export function useMessageListerer(callback : Function){    
     
    useEffect(() => {

        const recieveHandler = (message: IMessge) => {

            if(message == null) return;
            if(message.origin !== window.location.origin || message.source !== window ) 
                return;
            if(!(message.data && message.data.messageName === "ORBIS.FormGateway" && message.data.isValid!=null && message.data.fieldName != null)){
                return;
            }            
            console.log(`Message recieved`, message);
            callback(message.data);
        }
        window.addEventListener("message", recieveHandler, false);
        return () => window.removeEventListener("message", recieveHandler);
    });
}