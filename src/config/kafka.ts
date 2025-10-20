import { Consumer, EachMessagePayload, Kafka, KafkaConfig } from 'kafkajs';
import { MessageBroker } from '../types/broker';
import ws from '../../src/socket';
import config from 'config';

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    let kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };
    if (process.env.NODE_ENV === 'production') {
      kafkaConfig = {
        ...kafkaConfig,
        ssl: true,
        connectionTimeout: 45000,
        sasl: {
          mechanism: 'plain',
          username: config.get('kafka.sasl.username'),
          password: config.get('kafka.sasl.password'),
        },
      };
    }
    const kafka = new Kafka(kafkaConfig);

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        try {
          const value = message.value?.toString(); // Convert Buffer to string

          switch (topic) {
            case 'order':
              {
                const order = value ? JSON.parse(value) : null;
                ws.io.to(order.data.tenantId).emit('update-order', order);
              }
              break;
            default:
              console.log('Doing nothing...');
          }
        } catch (err) {
          console.error('Error parsing Kafka message:', err);
        }
      },
    });
  }
}
