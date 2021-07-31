module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "^/rpc": {
        target: "https://nft.coranos.cc/",
        pathRewrite: {
          "^/rpc": "/",
        },
      },
    },
  },
};
