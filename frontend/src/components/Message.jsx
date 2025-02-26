import React from 'react'

function Message({text, sender}) {
    return (
        <div
          className={`d-flex justify-content-${
            sender === 'user' ? 'end' : 'start'
          } mb-2`}
        >
          <div
            className={`p-3 rounded ${
              sender === 'user' ? 'bg-success text-white' : 'bg-light'
            }`}
          >
            {text}
          </div>
        </div>
      );
    };
    
    export default Message;