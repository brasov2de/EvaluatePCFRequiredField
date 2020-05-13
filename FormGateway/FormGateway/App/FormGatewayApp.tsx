import * as React from 'react';
import { useMessageListerer } from './Hooks/useMessageListener';


export interface IMessageContent {
    messageName: string;
    fieldName : string,
    isValid : boolean;
    errorMessage ?: string;
};



export interface IFormGatewayProps{  
    onValueChanged : (value ?: boolean) => void, 
    value ?: boolean
}



export const FormGatewayApp = function FormGatewayApp({ onValueChanged, value}: IFormGatewayProps) : JSX.Element {
    const [messages , setMessages]  = React.useState<Array<IMessageContent>>([]);
    const [isValid, setIsValid] = React.useState(value);

    const onMessageCallback = (newMessage : IMessageContent) => {    
        const cloneMessages = messages.filter((message) => message.fieldName!==newMessage.fieldName);        
        if(newMessage.isValid===false){
            setMessages([...cloneMessages, newMessage])
        }
        else{
            setMessages( cloneMessages );              
        }
    };
    useMessageListerer(onMessageCallback);    

    React.useEffect(() => {
        setIsValid( messages.length === 0 );
    }, [messages]);

    React.useEffect(()=> {
        onValueChanged(isValid);
    }, [isValid]);

    return isValid === true 
        ? (<div></div>)
        : (<div>
            {messages.map((message) => <div className="ErrorMessage">{message.errorMessage}</div> )}
        </div>);
    
}