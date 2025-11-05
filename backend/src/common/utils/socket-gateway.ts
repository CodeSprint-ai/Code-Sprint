// socket.gateway.ts (outline)
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws' })
export class SocketGateway {
  @WebSocketServer() server: Server;

  emitToUser(userId: string, event: string, payload: any) {
    // implement mapping userId->socketId (store during auth handshake), or rooms per userId
    this.server.to(`user_${userId}`).emit(event, payload);
  }
}
