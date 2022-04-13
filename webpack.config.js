const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production', // 模式
    entry: './main.js', // 打包入口地址
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.join(__dirname, 'dist'), // 输出文件目录
    },
    module: {
        rules: [
            // 转换规则
            {
                test: /\.less$/, //匹配所有的 less 文件
                use: ['style-loader', 'css-loader', 'less-loader'], // use: 对应的 Loader 名称
            },
        ],
    },
    plugins: [
        // 配置插件
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'dist'), // 静态文件目录
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        open: true, // 是否自动打开浏览器
    },
};
