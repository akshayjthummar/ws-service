import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { MessageBroker } from '../types/broker';

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });

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
          const data = value ? JSON.parse(value) : null; // Parse JSON safely

          console.log({
            topic,
            partition,

            value: data, // Human-readable
          });
        } catch (err) {
          console.error('Error parsing Kafka message:', err);
        }
      },
    });
  }
}
