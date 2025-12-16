// // socket.gateway.ts (outline)
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

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
  constructor(private readonly jwtService: JwtService) {}
  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;

    console.log({ token });

    try {
      const payload = await this.jwtService.verify(token,{
        secret:process.env.JWT_ACCESS_SECRET
      });
      console.log('🟢 Socket authenticated for user:', { payload });
      socket.join(`user_${payload.sub}`);
    } catch (e) {
      console.log('❌ Socket auth failed', e);
      socket.disconnect();
    }
  }

  sendSubmissionUpdate(userId: string, update: any) {
    console.log('submissionPayload by server',{update});
    
    this.server.to(`user_${userId}`).emit('submission.update', update);
  }
}
