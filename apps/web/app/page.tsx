'use client'
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider'
import classes from './page.module.css'
export default function Page()
{
  const { sendMessage, messages} = useSocket();
  const [message, setMessage] = useState('');
  return (
    <div className={classes['root']}>
      <div>
        <h1>All messages will appare here</h1>
        {messages.map((e) => {
          return <li className={classes['chat']}>{e}</li>
        })}
      </div>
      <div className={classes['line']}>
        <input
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(message); }}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Message"
          className={classes['chat-input']} />
        <button
          onClick={e => sendMessage(message)}
          className={classes['button']}>
          Send
        </button>
      </div>
      
    </div>
  )
}