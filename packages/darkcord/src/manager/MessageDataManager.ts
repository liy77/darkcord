import { CacheManager } from "@cache/CacheManager";
import { GuildTextChannel, TextBasedChannel } from "@resources/Channel";
import { Message } from "@resources/Message";
import { BaseCacheOptions } from "@typings/index";
import { Resolvable } from "@utils/Resolvable";
import {
  APIMessage,
  RESTGetAPIChannelMessagesQuery,
} from "discord-api-types/v10";
import { DataManager } from "./DataManager";

export class MessageDataManager extends DataManager<Message> {
  constructor(
    options: number | BaseCacheOptions,
    public manager: CacheManager,
    public channel: TextBasedChannel,
  ) {
    super(options, (get, id) => {
      let message = get(id) as unknown as APIMessage | Message | undefined;

      if (!message) return;

      if (!(message instanceof Message)) {
        const guild =
          "guild" in this.channel
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (this.channel as GuildTextChannel).guild
            : undefined;

        message = new Message(
          {
            ...message,
            client: this.manager.client,
          },
          guild,
        );
      }

      return Resolvable.resolveMessage(message, this.manager.client);
    });
  }

  get(id: string) {
    return this.cache.get(id);
  }

  fetch(id: string): Promise<Message>;
  fetch(options: RESTGetAPIChannelMessagesQuery): Promise<Message[]>;
  async fetch(
    options: string | RESTGetAPIChannelMessagesQuery,
  ): Promise<Message | Message[]> {
    if (typeof options === "string") {
      const message = await this.manager.client.rest.getMessage(
        this.channel.id,
        options,
      );

      return Resolvable.resolveMessage(
        new Message({
          ...message,
          client: this.manager.client,
        }),
        this.manager.client,
      );
    }

    const messageArr = await this.manager.client.rest.getMessages(
      this.channel.id,
      options,
    );

    return Promise.all(
      messageArr.map((message_1) =>
        Resolvable.resolveMessage(
          new Message({
            ...message_1,
            client: this.manager.client,
          }),
          this.manager.client,
        ),
      ),
    );
  }
}
