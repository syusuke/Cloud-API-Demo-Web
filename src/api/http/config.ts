export const CURRENT_CONFIG = {

  // license
  appId: '133969', // You need to go to the development website to apply.
  appKey: '40a12745ed8c9fc05c4cd50079f48d8', // You need to go to the development website to apply.
  appLicense: 'kDvvdO2kARuje3/L1+NGLO/rvm2hvxoVsCy5WtCpvUqUUDNvqO4cX5UJ/i1SJ8gQWN54YtbUt/O3ajg/1/YdT+2KwWJxrvry0sIn/E2nZLAW1x1VMl8BUiBuk3EcS9Vme0vmRC5DhiPtFLLdaddfamO/9dPjwRSfeTe8imRm34Q=', // You need to go to the development website to apply.

  // http
  // baseURL: 'http://192.168.17.96:6789/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  // websocketURL: 'ws://192.168.17.96:6789/api/v1/ws', // Example: 'ws://192.168.1.1:6789/api/v1/ws'
  // flightBaseUrl: 'http://192.168.17.96:18889/dji-flight/',

  baseURL: 'http://19.15.97.238:26885/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: 'ws://19.15.97.238:26885/api/v1/ws', // Example: 'ws://192.168.1.1:6789/api/v1/ws'
  flightBaseUrl: 'http://19.15.97.238:26880/api/smiiot-djiflight/dji-flight/',

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://19.15.97.237:26882/dji/', // Example: 'rtmp://192.168.1.1/live/'
  // rtmpURL: 'rtmp://121.37.222.163:1935/dji/', // Example: 'rtmp://192.168.1.1/live/'

  // RTSP
  rtspUserName: 'test',
  rtspPassword: 'test',
  rtspPort: '8554',

  // map
  // You can apply on the AMap website.
  amapKey: '806453ea366593ce3b1f82506eaf8fe4',

}
