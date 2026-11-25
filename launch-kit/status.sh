#!/usr/bin/env bash
# Shows where the Yohaku launch stands and the signing link, run from the launch folder.
#   bash ~/yohaku/launch-kit/status.sh            (the submitted Yohaku launch)
#   bash ~/yohaku/launch-kit/status.sh <launch-id>
#   bash ~/yohaku/launch-kit/status.sh --watch    (keeps checking until it is ready to sign)
set -euo pipefail

PROG_DIR="${PROGRAMMABLE_DIR:-$HOME/programmable-v4.4.3}"
LAUNCH_DIR="${LAUNCH_DIR:-$HOME/yoha-launch}"
CLI=(node "$PROG_DIR/packages/launch/bin/programmable-launch.mjs")
CONFIG="protected-launch.config.json"
DEFAULT_ID="a2f02324-9523-465f-86e2-497ee775a1f1"

cd "$LAUNCH_DIR"
: "${PROGRAMMABLE_API_KEY:?Set it first without showing it:  read -rs PROGRAMMABLE_API_KEY && export PROGRAMMABLE_API_KEY}"

WATCH=()
ID=""
for a in "$@"; do
  case "$a" in
    --watch) WATCH=(--watch --until authorized) ;;
    *) ID="$a" ;;
  esac
done
if [ -z "$ID" ] && [ -f submit-result.json ]; then
  ID="$(node -e 'const r=require("./submit-result.json");const f=(o)=>o&&typeof o==="object"?(o.launchId??Object.values(o).map(f).find(Boolean)):undefined;process.stdout.write(f(r)||"")' 2>/dev/null || true)"
fi
ID="${ID:-$DEFAULT_ID}"

ARGS=(status "$ID")
[ -f "$CONFIG" ] && ARGS+=(--config "$CONFIG")
echo "── Yohaku launch $ID"
"${CLI[@]}" "${ARGS[@]}" "${WATCH[@]}" | tee status.json >/dev/null

node -e '
const s = require("./status.json");
const find = (o, k) => { if (!o || typeof o !== "object") return undefined; if (k in o) return o[k];
  for (const v of Object.values(o)) { const r = find(v, k); if (r !== undefined) return r; } };
const show = (label, v) => { if (v !== undefined && v !== null && v !== "") console.log(label.padEnd(18), typeof v === "object" ? JSON.stringify(v) : v); };
const review = find(s, "manualReview") || {};
show("Review", review.state);
show("Approved at", review.approvedAt);
show("Sign before", find(s, "expiresAt") ?? review.expiresAt);
show("Seconds left", find(s, "secondsRemaining"));
show("Action needed", find(s, "actionRequired"));
show("Launch requested", review.launchRequestedAt);
show("Mainnet sent", find(s, "mainnetTransactionsSent"));
show("Failure", find(s, "failure"));
const url = find(s, "walletHandoffUrl");
console.log();
if (url) console.log("Signing link (open this exact link, connect 0xa340…D46D):\n  " + url);
else console.log("No signing link yet. Programmable shows it once the launch is ready to sign.\nFull details are in ~/yoha-launch/status.json");
'
