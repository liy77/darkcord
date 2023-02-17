export enum GatewayStatus {
  Connected,
  Disconnected,
  Resuming,
  Closing,
  Identifying,
  Connecting,
  Reconnecting,
  Handshaking,
  Destroyed,
  Ready,
  WaitingGuilds,
}

export enum ShardEvents {
  Connect = "connect",
  Reconnecting = "reconnecting",
  Close = "close",
  Resume = "resume",
  ReconnectRequired = "reconnectRequired",
  Ping = "ping",
  Hello = "hello",
  Debug = "debug",
  PreReady = "preReady",
  Error = "error",
  Dispatch = "dispatch",
  Ready = "ready",
}
