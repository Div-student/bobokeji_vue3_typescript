module.exports = {
  devServer: { 
    disableHostCheck: true, 
    overlay: {
      warnings: false,
      errror: false
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/scss/variables.scss";`
      }
    }
  }
}