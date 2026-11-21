# Contributing to SpeedDash

spotted a bug or want to add a cool slot chart? jump right in bhai, PRs are welcome.

## local setup

* clone the repo and run `npm install`.
* start the local dev server with `npm run dev`.
* run `npm run typecheck`, `npm test`, and `npm run build` before opening a PR.

## ui color rules

* keep every button, badge, and card pure dark obsidian monochrome (`#0B0B0E` background, `#141418` surface, `#26262E` border, `#FFFFFF` or `#E4E4E7` text).
* active tabs and primary buttons use solid white (`#FFFFFF` background with `#000000` text).
* please do not add green, red, blue, amber, or purple pill backgrounds anywhere.

## code notes

* keep browser views working on public Solana RPC without paid API keys.
* always keep the offline simulator fallback alive so the app still runs on train wifi when RPC calls time out.
* add `node:test` cases in `test/speed-core.test.mjs` if you touch `lib/speed-core/`.
