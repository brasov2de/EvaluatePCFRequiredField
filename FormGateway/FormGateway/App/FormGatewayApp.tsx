import * as React from 'react';
import { useMessageListerer } from './Hooks/useMessageListener';


export interface IMessageContent {
    messageName: string;
    fieldName : string,
    isValid : boolean;
    errorMessage ?: string;
};



export interface IFormGatewayProps{
    targetValue ?: boolean;
    onValueChanged : (value: boolean) => void
}



export const FormGatewayApp = function FormGatewayApp({targetValue, onValueChanged}: IFormGatewayProps) : JSX.Element {
    const [messages , setMessages]  = React.useState<Array<IMessageContent>>([]);
    const [isValid, setIsValid] = React.useState(true);

    const onMessageCallback = React.useCallback((newMessage : IMessageContent) => {    
        const cloneMessages = messages.filter((message) => message.fieldName!==newMessage.fieldName);        
        if(newMessage.isValid===false){
            setMessages([...cloneMessages, newMessage])
        }
        setMessages( cloneMessages );              
    }, []);
    useMessageListerer(onMessageCallback);    

    React.useEffect(() => {
        setIsValid(messages.length === 0);
    }, [messages]);

    React.useEffect(()=> {
        onValueChanged(isValid);
    }, [isValid]);

    return isValid === true 
        ? (<div></div>)
        : (<div>
            {messages.map((message) => <div>{message.errorMessage}</div> )}
        </div>);
    
}