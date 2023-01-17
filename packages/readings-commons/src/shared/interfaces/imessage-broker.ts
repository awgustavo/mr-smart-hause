export interface IMessageBroker<TMessageType> {
    sendMessage(entity: TMessageType, url: string);
}