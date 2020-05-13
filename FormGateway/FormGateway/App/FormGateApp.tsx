import * as React from 'react';
import { useMessageListerer } from './Hooks/useMessageListener';


export interface IMessageContent {
    messageName: string;
    fieldName : string,
    isValid : boolean;
    errorMessage ?: string;
};



export interface IFormGateProps{  
    onValueChanged : (value ?: boolean) => void;
    value ?: boolean;
    messageName : string;
}



export const FormGateApp = function FormGateApp({ onValueChanged, value, messageName}: IFormGateProps) : JSX.Element {
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
    useMessageListerer(onMessageCallback, messageName);    

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