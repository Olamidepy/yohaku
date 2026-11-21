# Yohaku launch kit (Ubuntu)

Builds and submits the Yohaku (YOHA) Custom Launch request with Programmable's own launch package
(release `programmable-launch-v4.4.3`) and its required launch protection.
Nothing here signs or sends a transaction: you sign on programmable.market with the dev wallet after approval.

| Setting | Value |
|---|---|
| Token | Yohaku (YOHA), 1,000,000,000 supply |
| Launch / dev wallet | `0xa340b018F10BCE89397B3AEE4476cfe2F257D46D` |
| Fees | 0.3% Programmable + 4.7% creator, on buys and sells (5% total) |
| First buy | about $2 of ETH, from the dev wallet (skips the 99% opening fee) |
| Opening value | about $17,000 FDV (Programmable's floor is $15,000) |
| Protection | 99% opening fee falling to normal over 30 s; 2% per-wallet cap for 5 min; liquidity locked forever |
| Platform fees | bound from Programmable's live capabilities (automatic payout when active) |
| Links | yohamarket.xyz, x.com/yoha_market, image yohamarket.xyz/token.png |

All settings live at the top of `build-launch.mjs`.

## Before you run it

1. The website must be live at **www.yohamarket.xyz** with the new logo: the script downloads
   `https://www.yohamarket.xyz/token.png` and binds those exact bytes.
2. Node 24.14+ and git on Ubuntu, and `gh auth login` so the script can create the public source repo.

## Run it

```bash
git clone https://github.com/Olamidepy/yohaku ~/yohaku
read -rs ETH_RPC_URL && export ETH_RPC_URL                      # Alchemy URL with NO domain restriction
read -rs PROGRAMMABLE_API_KEY && export PROGRAMMABLE_API_KEY    # hidden
bash ~/yohaku/launch-kit/launch.sh
```

`launch.sh` installs Programmable's package into `~/programmable-v4.4.3`, builds a draft, publishes the exact
contract sources to the public repo `github.com/Olamidepy/yoha-launch` (created if missing), builds again bound to that
commit, runs Programmable's preflight and asks before submitting. Keep `yoha-launch` public until review is done.

The signing window is 24 hours from the final build. Build at a time that leaves you room to sign after approval.
