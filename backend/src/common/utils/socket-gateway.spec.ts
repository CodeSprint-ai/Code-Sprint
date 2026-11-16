import { JwtService } from '@nestjs/jwt';
import { SubmissionGateway } from './socket-gateway';

describe('Submission socket authentication', () => {
  it('joins the verified user room without logging credentials', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      const verify = jest.fn().mockReturnValue({ sub: 'user' });
      const gateway = new SubmissionGateway({ verify } as unknown as JwtService);
      const socket = { handshake: { auth: { token: 'private-token' } }, join: jest.fn(), disconnect: jest.fn() };
      await gateway.handleConnection(socket as any);
      expect(socket.join).toHaveBeenCalledWith('user_user');
      expect(socket.disconnect).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('disconnects invalid tokens without logging the token or verification error', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      const gateway = new SubmissionGateway({ verify: () => { throw new Error('private-token'); } } as unknown as JwtService);
      const socket = { handshake: { auth: { token: 'private-token' } }, join: jest.fn(), disconnect: jest.fn() };
      await gateway.handleConnection(socket as any);
      expect(socket.disconnect).toHaveBeenCalled();
      expect(socket.join).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
