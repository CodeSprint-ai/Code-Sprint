// // socket.gateway.ts (outline)
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

// @WebSocketGateway({ namespace: '/ws' })
// export class SocketGateway {
//   @WebSocketServer() server: Server;

//   emitToUser(userId: string, event: string, payload: any) {
//     // implement mapping userId->socketId (store during auth handshake), or rooms per userId
//     this.server.to(`user_${userId}`).emit(event, payload);
//   }
// }


@WebSocketGateway({ cors: true })
export class SubmissionGateway {
  constructor(private readonly jwtStrategy: JwtStrategy) { }
  @WebSocketServer() server: Server;


  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;
    try {
      const payload = await this.jwtStrategy.validate(token);
      socket.join(`user_${(payload).uuid}`);
    } catch (e) {
      socket.disconnect();
    }
  }


  sendSubmissionUpdate(userId: string, update: any) {
    this.server.to(`user_${userId}`).emit('submission.update', update);
  }
}