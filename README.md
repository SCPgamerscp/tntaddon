# 大爆発TNT (Big Boom TNT) — Minecraft Bedrock Edition アドオン

バニラのTNTと見た目は同一ですが、爆発力（パワー）200・起爆までのフューズ10秒という特別な性能を持つ「大爆発TNT」を追加するアドオンです。

## 特徴

- **アイテム/エンティティ名**: 大爆発TNT (`bigboomtnt:big_boom_tnt` / `bigboomtnt:primed_big_boom_tnt`)
- **爆発力**: 200（バニラTNTは4）
- **起爆までの時間**: 10秒（バニラTNTは4秒）
- **見た目**: バニラのTNTブロックと完全に同一のテクスチャ（`tnt_top` / `tnt_bottom` / `tnt_side`）
- **地形破壊**: あり（`breaks_blocks: true`）
- **ダメージ**: プレイヤー・モブに通常のTNT爆発と同様にダメージを与える
- **クラフトレシピ**: レッドストーンブロック + 通常のTNTブロック（シェイプレス）

## 使い方

1. `dist/big_boom_tnt.mcaddon` をMinecraft Bedrock Editionで開く（またはダブルタップ/ダブルクリック）とBehavior Pack / Resource Packが自動的にインポートされます。
2. ワールド作成時に「大爆発TNT」のBehavior PackとResource Packを両方有効化してください。
3. サバイバル/クリエイティブでレッドストーンブロックと通常のTNTを組み合わせてクラフトするか、`/give @s bigboomtnt:big_boom_tnt` コマンドで入手できます。
4. 設置後、フリント&スティールで着火すると10秒後に爆発力200で爆発します（バニラのTNTと同様、レッドストーン信号でも起爆できるよう`minecraft:on_interact`だけでなくブロックの通常仕様を踏襲しています）。

## 実装のポイント

- スクリプトAPI（Beta APIsトグル）を使わず、**JSON定義のみ**で実装しています。
  - ブロックの起爆判定は `minecraft:on_interact` コンポーネントと `query.is_item_name_any` Molangクエリでフリント&スティールを検知。
  - 起爆時は `run_command` の `summon` コマンドでカスタムのprimed TNTエンティティを生成し、元のブロックは `air` に変換。
  - 起爆エンティティ側は `minecraft:explode` コンポーネントで `power: 200`, `fuse_length: 10`, `fuse_lit: true` を設定。
- テクスチャは公式 Mojang/bedrock-samples リポジトリのバニラTNTブロックテクスチャをそのまま利用し、見た目の完全な一致を実現しています。

## ディレクトリ構成

```
dist/
├── big_boom_tnt.mcaddon        # 配布用パッケージ（.mcaddon）
├── big_boom_tnt_bp/            # Behavior Pack
│   ├── manifest.json
│   ├── blocks/big_boom_tnt.json
│   ├── entities/primed_big_boom_tnt.json
│   ├── recipes/big_boom_tnt.json
│   └── texts/ (en_US.lang, ja_JP.lang, languages.json)
└── big_boom_tnt_rp/            # Resource Pack
    ├── manifest.json
    ├── blocks.json
    ├── entity/big_boom_tnt.entity.json
    ├── models/entity/big_boom_tnt.geo.json
    ├── textures/
    │   ├── blocks/ (big_boom_tnt_top.png, big_boom_tnt_bottom.png, big_boom_tnt_side.png)
    │   ├── entity/big_boom_tnt_atlas.png
    │   └── terrain_texture.json
    └── texts/ (en_US.lang, ja_JP.lang, languages.json)
```

## 今後の拡張予定

将来的に爆発力の異なる複数のTNT（例: 爆発力50, 100, 500など）を追加できるよう、識別子・クラフトレシピの体系を拡張可能な設計にしています。

## 不具合修正履歴

初期実装時、ゲーム内に「大爆発TNT」が一切追加されない不具合が発生していました。原因調査の結果、以下の問題を特定し修正しました。

1. **ブロックコンポーネント名の誤り**
   `minecraft:destroy_time` / `minecraft:explosion_resistance` は Bedrock 1.19.20 で廃止された古いコンポーネント名でした。現行仕様の `minecraft:destructible_by_mining`（`seconds_to_destroy`）/ `minecraft:destructible_by_explosion`（`explosion_resistance`）に置き換えました。
2. **format_version 不足**
   上記コンポーネントは format_version 1.21.50 以降が必要なため、ブロックJSONの format_version を `1.21.60` に更新しました。
3. **`menu_category.group` の名前空間未指定**
   Bedrock 1.21.60 以降、`menu_category.group` の値には名前空間が必須になりました。`itemGroup.name.tnt` → `minecraft:itemGroup.name.tnt` に修正しました。
4. **リソースパック側クライアントエンティティの identifier 不一致**
   `big_boom_tnt.entity.json` の identifier が `bigboomtnt:big_boom_tnt` のままで、実際に起爆時にサモンされるエンティティ `bigboomtnt:primed_big_boom_tnt` と一致していませんでした。これによりプリムドTNTの見た目（テクスチャ・モデル）が正しく描画されない問題があったため、ファイル名・identifier を `primed_big_boom_tnt.entity.json` / `bigboomtnt:primed_big_boom_tnt` に修正しました。
5. **manifest.json の min_engine_version 更新**
   上記コンポーネント要件に合わせて `min_engine_version` を `[1, 21, 60]` に更新しました。

これらの修正により、ブロック定義のパースエラーが解消され、「大爆発TNT」がクリエイティブインベントリ・クラフトレシピ経由で正常に入手・設置・起爆できるようになりました。
