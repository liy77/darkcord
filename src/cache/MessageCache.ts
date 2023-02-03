import {
  APIMessage,
  RESTGetAPIChannelMessagesQuery,
} from "discord-api-types/v10";
import { GuildTextChannel, TextBasedChannel } from "@resources/Channel";
import { Message } from "@resources/Message";
import { BaseCacheOptions } from "@typings/index";
import { Cache } from "./Cache";
import { CacheManager } from "./CacheManager";
import { Resolvable } from "@utils/Resolvable";

export class ChannelMessageCache extends Cache<Message> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public channel: TextBasedChannel
  ) {
    super(options, manager.adapter);
  }

  get(id: string) {
    let message = super.get(id) as unknown as APIMessage | Message | undefined;

    if (!message) return;

    if (!(message instanceof Message)) {
      const guild =
        "guild" in this.channel
          ? (this.channel as GuildTextChannel).guild
          : undefined;

      message = new Message(
        {
          ...message,
          client: this.manager.client,
        },
        guild
      );
    }

    return Resolvable.resolveMessage(message, this.manager.client);
  }

  add(message: Message | APIMessage, replace = true) {
    return super._add(message, replace, message.id);
  }

  fetch(id: string): Promise<Message>;
  fetch(options: RESTGetAPIChannelMessagesQuery): Promise<Message[]>;
  async fetch(
    options: string | RESTGetAPIChannelMessagesQuery
  ): Promise<Message | Message[]> {
    if (typeof options === "string") {
      const message = await this.manager.client.rest.getMessage(
        this.channel.id,
        options
      );

      return Resolvable.resolveMessage(
        new Message({
          ...message,
          client: this.manager.client,
        }),
        this.manager.client
      );
    }

    const messageArr = await this.manager.client.rest.getMessages(
      this.channel.id,
      options
    );

    return Promise.all(
      messageArr.map((message_1) =>
        Resolvable.resolveMessage(
          new Message({
            ...message_1,
            client: this.manager.client,
          }),
          this.manager.client
        )
      )
    );
  }
}
