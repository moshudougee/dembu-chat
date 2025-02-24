import React from 'react'

const TriggerButton = ({message, sender}: {message: string, sender: string}) => {
    const triggerEvent = async () => {
        const response = await fetch('/api/trigger-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: 'my-channel',
            event: 'my-event',
            message: message,
            sender: sender,
          }),
        });
    
        const result = await response.json();
        console.log(result);
      };
    
      return (
            <button 
                onClick={triggerEvent} 
                className={`bg-blue-500 text-white p-2 rounded-md ${message.length === 0 ? 'opacity-50' : 'cursor-pointer'}`}
                disabled={message.length === 0}
            >
                Send
            </button>
      )
}

export default TriggerButton