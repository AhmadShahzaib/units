const localHostConfig = {
  localHost: '127.0.0.1',
  localPort: 27000,
};
const devServerTunnelConfig = {
  username: 'serviceuser',
  password: 'user@221',
  host: '192.168.1.54',
  port: 22,
  dstHost: '127.0.0.1',
  dstPort: 27017,
  ...localHostConfig,
  mongoDBUri: `mongodb://${localHostConfig.localHost}:${localHostConfig.localPort}/nestjsauth`,
};

export default {
  devServerTunnelConfig,
};
