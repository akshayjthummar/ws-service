export interface MessageBroker {
  connectConsumer: () => Promise<void>;
  disconnectConsumer: () => Promise<void>;
  consumeMessage: (_topics: string[], _fromBeginning: boolean) => Promise<void>;
}
