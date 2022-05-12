import { ServiceBusClient, ServiceBusMessage, ServiceBusMessageBatch, ServiceBusReceiver, ServiceBusSender } from "@azure/service-bus";
import EventEmitter from "events";
import Queues from "../config/queues.config.json";

interface ServiceBusProps {
  queueName: string;
}

class ServiceBus extends EventEmitter {
  batch: ServiceBusMessageBatch;
  connection: ServiceBusClient;
  queueName: string;
  receiver: ServiceBusReceiver;
  sender: ServiceBusSender;

  constructor(options: ServiceBusProps = {} as ServiceBusProps) {
    super();
    this.queueName = options.queueName;
    this.connection = new ServiceBusClient(process.env.SERVICE_BUS);
    this.receiver = this.connection.createReceiver(this.queueName);
    this.sender = this.connection.createSender(this.queueName);
  }

  async fixAndResendMessage(oldMessage: ServiceBusMessage) {
    const sender = this.connection.createSender(this.queueName);
    const repairedMessage = { ...oldMessage };

    await sender.sendMessages(repairedMessage);
  }

  async processDeadletterMessageQueue() {
    const messages = await this.receiver.receiveMessages(1);

    if (messages.length > 0) {
      console.log(">>>>> Received the message from DLQ - ", messages[0].body);

      await this.fixAndResendMessage(messages[0]);
      await this.receiver.completeMessage(messages[0]);
    } else {
      console.log(">>>> Error: No messages were received from the DLQ.");
    }
  }

  async sendToQueue(body: any) {
    await this.sender.sendMessages({ body });
  }
}

export default {
  NeoWay: new ServiceBus({ queueName: Queues.neoWay }),
};
