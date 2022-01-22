import amqp from 'amqplib/callback_api';
import { users } from '../database/models/users';
import { RabbitMqEventTypes } from '../interfaces/rabbitMqQueues';

const events = [
  RabbitMqEventTypes.USER_CREATED,
  RabbitMqEventTypes.USER_UPDATED,
];

type CreateUserMessagePayload = {
  eventType: RabbitMqEventTypes;
  name?: string;
  externalId: string;
};

interface TranslateFunctionsType {
  [RabbitMqEventTypes.USER_CREATED]: (
    user: CreateUserMessagePayload,
  ) => Promise<void>;
  [RabbitMqEventTypes.USER_UPDATED]: (
    user: CreateUserMessagePayload,
  ) => Promise<void>;
}

async function createUserFromMessage(user: CreateUserMessagePayload) {
  const { name, externalId } = user;
  try {
    await users.create({ name, external_id: externalId });
  } catch (error) {
    console.log(error);
  }
}
async function updateUserFromMessage(user: CreateUserMessagePayload) {
  const { name, externalId } = user;
  try {
    await users.update(
      { name, external_id: externalId },
      { where: { external_id: externalId } },
    );
  } catch (error) {
    console.log(error);
  }
}

const translate: TranslateFunctionsType = {
  [RabbitMqEventTypes.USER_CREATED]: createUserFromMessage,
  [RabbitMqEventTypes.USER_UPDATED]: updateUserFromMessage,
};

export function saveRabbitMqMessage(msg: amqp.Message | null) {
  try {
    if (!msg) {
      throw new Error('message is empty');
    }
    const convertedMsg: CreateUserMessagePayload = JSON.parse(
      msg.content.toString(),
    );

    if (!events.find(event => event === convertedMsg.eventType)) {
      throw new Error('received event not found');
    }
    translate[convertedMsg.eventType](convertedMsg);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
