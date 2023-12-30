const { defineConfig } = require('@vue/cli-service');


module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        win: {
          icon: 'src/assets/icon.png'
        },
      }
    },
    
    },
  configureWebpack: {
    // No need for target: 'electron-renderer' here, the Electron Vue CLI plugin should handle it
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify')
      }
    },
    node: {
      __dirname: true,
      __filename: true
    },
    externals: {
      electron: 'electron'
    },
    
  }

});
