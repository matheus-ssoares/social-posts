import amqp from 'amqplib/callback_api';
import { RabbitMqQueues } from '../interfaces/rabbitMqQueues';
import { saveRabbitMqMessage } from './saveRabbitMqMessage';

export function rabbitMqConnect(queue: RabbitMqQueues) {
  amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) throw error0;
    connection.createChannel(function (error1, channel) {
      if (error1) throw error1;

      channel.assertQueue(queue, {
        durable: false,
      });
      console.log(' [*] Listening messages in %s', queue);
      channel.consume(queue, saveRabbitMqMessage);
    });
  });
}
