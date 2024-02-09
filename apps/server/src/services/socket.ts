import { Server } from "socket.io";
import Redis from 'ioredis'

const pub = new Redis(
  {
    host: process.env.HOST,
    port: Number(process.env.REDIS_PORT),
    username: 'default',
    password: process.env.PASSWORD,
  }
)
const sub = new Redis({
  host: process.env.HOST,
  port:  Number(process.env.REDIS_PORT),
  username: 'default',
  password: process.env.PASSWORD
})

class SocketService{
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...")
    this._io = new Server({
        cors: {
        allowedHeaders: ['*'],
          origin:'*'
        }
      }
    );
    sub.subscribe('MESSAGES');
  }
  public initListeners() {
    console.log(`Init Socket Listners...`);
    const io = this.io;
    io.on('connect', (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('New Message Recived : ', message)
        //Publish the message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }));
      });
    })
    sub.on('message', (channel, message) => {
      if (channel == 'MESSAGES')
      {
        io.emit('message', message);
      }
    })
  }
  get io() {
    return this._io;
  }
}

export default SocketService;