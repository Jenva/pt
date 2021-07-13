module.exports = {
  devServer: {
    port: 1000,
    proxy: {
        '/sail-analysis-server': {  // 'demo'是请求地址中，以demo开头都适用这个
            target: 'http://tangfanxin.f3322.net:30001', // 真实的服务器地址
            changeOrigin: true, // 
            secure: false, // 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受设为false
            ws: true, // 是否启用websockets
            // 是否重写
            pathRewrite: {
              '^/sail-analysis-server': '/sail-analysis-server'
            }
        },
        '/sail-file-server/': {  // 'demo'是请求地址中，以demo开头都适用这个
            target: 'http://tangfanxin.f3322.net:30001', // 真实的服务器地址
            changeOrigin: true, // 
            secure: false, // 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受设为false
            ws: true, // 是否启用websockets
            // 是否重写
            pathRewrite: {
              '^/sail-file-server': '/sail-file-server'
            }
        }
    }
  }
}