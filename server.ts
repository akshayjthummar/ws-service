import logger from './src/config/logger';
import { createMessageBroker } from './src/factories/broker-factory';
import { MessageBroker } from './src/types/broker';
import ws from './src/socket';
import config from 'config';

const startServer = async () => {
  let broker: MessageBroker | null = null;
  const PORT = config.get('server.port');
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(['order'], false);
    ws.wsServer
      .listen(PORT, () => {
        console.log('listining on port' + config.get('server.port'));
      })
      .on('error', (error) => {
        console.log('error', error.message);
        process.exit(1);
      });
  } catch (err: any) {
    logger.error('Error happened: ', err);
    if (broker) {
      await broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();
