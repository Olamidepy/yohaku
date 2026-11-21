#!/usr/bin/env bash
# One-time setup on Ubuntu: Programmable's launch package (pinned release) + the launch folder.
set -euo pipefail

PROG_DIR="${PROGRAMMABLE_DIR:-$HOME/programmable-v4.4.3}"
LAUNCH_DIR="${LAUNCH_DIR:-$HOME/yoha-launch}"
TAG="programmable-launch-v4.4.3"
COMMIT="3bfbe363c4f8b8d58aef281e50604e382b03b3ac"

# Node 24.14+ is required by Programmable's package.
if ! command -v node >/dev/null || ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a===24&&b>=14?0:1)'; then
  echo "✖ Node 24.14+ is required. Install it with:"
  echo "    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
  echo "    source ~/.bashrc && nvm install 24 && nvm use 24"
  exit 1
fi
command -v git >/dev/null || { echo "✖ git is required: sudo apt install -y git"; exit 1; }

if [ ! -d "$PROG_DIR/.git" ]; then
  git clone --depth 1 --branch "$TAG" https://github.com/programmablehq/PROGRAMMABLE "$PROG_DIR"
fi
actual="$(git -C "$PROG_DIR" rev-parse HEAD)"
if [ "$actual" != "$COMMIT" ]; then
  echo "✖ $PROG_DIR is at $actual, expected release commit $COMMIT ($TAG). Remove the folder and run again."
  exit 1
fi
(cd "$PROG_DIR/packages/launch" && npm ci --ignore-scripts --no-audit --no-fund)
echo "Programmable launch CLI: $(node "$PROG_DIR/packages/launch/bin/programmable-launch.mjs" --version)"

mkdir -p "$LAUNCH_DIR"
[ -d "$LAUNCH_DIR/.git" ] || git -C "$LAUNCH_DIR" init -q -b main
echo
echo "✔ Setup done."
echo "  Launch package: $PROG_DIR/packages/launch"
echo "  Launch folder:  $LAUNCH_DIR"
