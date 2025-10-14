# DiscordBot2

## discordbot 制作第２弾

### 要求：投票を作る時毎度窓書くのを楽にしたいという前回の制作では send.message を使いテキストチャット内に絵文字による投票機能を作りましたが、今回は Discord のネイティブ UI で直接実行できるようにしその結果を DB で保存および呼び出しができるようにしたい

### 要件（要求を満たすために何が必要か）：投票システムをテンプレート化する、特定の時間で自動的に発射したい

### 仕様・機能（要件を満たすために何が必要か）：毎日正午に〜８、８〜９、９、１０〜、時間未定という５つの項目の投票を発射する。随時 DB に投票結果を保存して任意のタイミングで呼び出せるようにする。

### 基本設計：TS、discord API、Mysql2、Koyeb

---

### やることリスト：

- ~~ DEVELOPER PORTAL  を使い discordbot アカウントの作成&初期設定{1} ~~2h
  ~~ →  トークンの取得 ~~0.1h
- テストサーバーに bot を入れる。工数 2h
- ~~ discordAPI を用いる必要があるかの調査。工数 10h ~~ 0h

- ~~TS を用いて投票する項目を指定できるようにする(poc)。10h~~
- ~~TS を用いて項目数を５つまで追加できるようにする。1h~~
- TS を用いて指定した時間に投票が締め切られるようにする(poc)。10h
- ~~TS を用いて指定した時間に発射されるようにする(poc)。5h~~
  ＊逐一テストサーバーで試す。
  ↓
- 拠点サーバーで使う 1h

## 使ったサイト

- 誰でも作れる！Discord Bot（基礎編）
  https://qiita.com/1ntegrale9/items/cb285053f2fa5d0cccdf
- koyeb（ホスティングサービス）
  https://app.koyeb.com/services/f5154f82-efdd-4eb3-ab0b-71351472ad8b?deploymentId=190ba4c1-31c8-40a8-b298-bd16ea4b39de
- UptimeRobot（指定したスケジュールで HTTP リクエストを送るサービス）スリープ防止用
  https://dashboard.uptimerobot.com/monitors/800874343

## 締日：６末
