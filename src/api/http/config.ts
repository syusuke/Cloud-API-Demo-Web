export const CURRENT_CONFIG = {

  // license
  appId: '133969', // You need to go to the development website to apply.
  appKey: '40a12745ed8c9fc05c4cd50079f48d8', // You need to go to the development website to apply.
  appLicense: 'kDvvdO2kARuje3/L1+NGLO/rvm2hvxoVsCy5WtCpvUqUUDNvqO4cX5UJ/i1SJ8gQWN54YtbUt/O3ajg/1/YdT+2KwWJxrvry0sIn/E2nZLAW1x1VMl8BUiBuk3EcS9Vme0vmRC5DhiPtFLLdaddfamO/9dPjwRSfeTe8imRm34Q=', // You need to go to the development website to apply.

  // http
  baseURL: 'http://192.168.17.96:6789/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: 'ws://192.168.17.96:6789/api/v1/ws', // Example: 'ws://192.168.1.1:6789/api/v1/ws'
  flightBaseUrl: 'http://192.168.17.96:18889/dji-flight/',

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://19.15.97.238:26501/dji/', // Example: 'rtmp://192.168.1.1/live/'
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.
  gbServerIp: 'Please enter the server ip.',
  gbServerPort: 'Please enter the server port.',
  gbServerId: 'Please enter the server id.',
  gbAgentId: 'Please enter the agent id',
  gbPassword: 'Please enter the agent password',
  gbAgentPort: 'Please enter the local port.',
  gbAgentChannel: 'Please enter the channel.',
  // RTSP
  rtspUserName: 'test',
  rtspPassword: 'test',
  rtspPort: '8554',
  // Agora
  agoraAPPID: 'Please enter the agora app id.',
  agoraToken: 'Please enter the agora temporary token.',
  agoraChannel: 'Please enter the agora channel.',

  // map
  // You can apply on the AMap website.
  amapKey: '806453ea366593ce3b1f82506eaf8fe4',

}
