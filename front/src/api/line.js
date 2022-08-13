const Line = require('./lineNootify');
const myLine = new Line();

// LINE Notify トークンセット
myLine.setToken("pXo1zUcUFvD0Phyu2yDSreMQPjAFzH1YMiVz2BoDLdP");
// LINE Notify 実行（「こんにちは！」とメッセージを送る）
myLine.notify('こんにちは！');