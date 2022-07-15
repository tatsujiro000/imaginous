/*************************
  sample.js
 *************************/
// ----------------------
// パッケージのインスタンス生成
// ----------------------
const Calendar = require('node-google-calendar'),
    config = require('./credentials/calendar-config'),
    calId = config.calendarId.myCal;
const cal = new Calendar(config);
// ----------------------
// カレンダーイベントの取得
// ----------------------
// 取得する対象期間を指定
// timeMinからtimeMaxの間のカレンダーイベントが取得される
const params = {
  timeMin: '2022-07-01T06:00:00+09:00',
  timeMax: '2022-07-17T06:00:00+09:00',
}
cal.Events.list(calId, params)
.then(calEvents => {
  console.log(calEvents);
})
.catch(err => {
  console.log(err.message);
});
