#!/usr/bin/env sh
set -eu

LC_ALL=C
export LC_ALL

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
DOCS="$ROOT/docs"
README="$ROOT/README.md"
DEFAULT_MESSAGE='build: update UI/UX elements and refresh generated assets'
REMOTE='origin'
BRANCH='main'
COMMIT_MESSAGE=''

if [ "$#" -gt 0 ]; then
  if [ "$1" = '--no-message' ]; then
    [ "$#" -eq 1 ] || {
      echo 'usage: ./scripts/build.sh ["commit message" | --no-message]' >&2
      exit 2
    }
    COMMIT_MESSAGE="$DEFAULT_MESSAGE"
  else
    COMMIT_MESSAGE="$*"
  fi
fi

mkdir -p \
  "$ROOT/components" \
  "$ROOT/styles" \
  "$DOCS/components" \
  "$DOCS/styles/themes"

cat "$ROOT"/src/js/*.js > "$ROOT/components/ui.js"
cat "$ROOT"/src/css/*.css > "$ROOT/styles/base.css"
cat "$ROOT"/src/docs-gallery/*.js > "$DOCS/gallery.js"

cp "$ROOT/components/ui.js" "$DOCS/components/ui.js"
cp "$ROOT/styles/base.css" "$DOCS/styles/base.css"
cp "$ROOT/styles/fonts.css" "$DOCS/styles/fonts.css"
cp "$ROOT/styles/themes/dark.css" "$DOCS/styles/themes/dark.css"
cp "$ROOT/styles/themes/light.css" "$DOCS/styles/themes/light.css"

touch "$DOCS/.nojekyll"

START='<!-- PROJECT_TREE_START -->'
END='<!-- PROJECT_TREE_END -->'

grep -qxF "$START" "$README"
grep -qxF "$END" "$README"

TREE="$(mktemp)"
OUT="$(mktemp)"
trap 'rm -f "$TREE" "$OUT"' EXIT HUP INT TERM

(
  cd "$ROOT"
  tree -a --charset UTF-8 -I '.git'
) > "$TREE"

awk -v start="$START" -v end="$END" -v tree="$TREE" '
  $0 == start {
    print
    print "```text"
    while ((getline line < tree) > 0) {
      print line
    }
    close(tree)
    print "```"
    skip = 1
    next
  }

  $0 == end {
    skip = 0
    print
    next
  }

  !skip {
    print
  }
' "$README" > "$OUT"

mv "$OUT" "$README"
trap - EXIT HUP INT TERM
rm -f "$TREE"

if [ -n "$COMMIT_MESSAGE" ]; then
  git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo 'build complete, but commit/push skipped: not a Git working tree' >&2
    exit 1
  }

  CURRENT_BRANCH="$(git -C "$ROOT" branch --show-current)"
  [ "$CURRENT_BRANCH" = "$BRANCH" ] || {
    echo "build complete, but commit/push skipped: expected branch '$BRANCH', got '$CURRENT_BRANCH'" >&2
    exit 1
  }

  REMOTE_URL="$(git -C "$ROOT" remote get-url "$REMOTE" 2>/dev/null || true)"
  case "$REMOTE_URL" in
    https://github.com/FabioFlorey/userscripts-runtime|https://github.com/FabioFlorey/userscripts-runtime.git|git@github.com:FabioFlorey/userscripts-runtime.git)
      ;;
    *)
      echo "build complete, but commit/push skipped: '$REMOTE' is not FabioFlorey/userscripts-runtime" >&2
      exit 1
      ;;
  esac

  git -C "$ROOT" add -A

  if git -C "$ROOT" diff --cached --quiet; then
    echo 'build complete; nothing to commit'
  else
    git -C "$ROOT" commit -m "$COMMIT_MESSAGE"
  fi

  git -C "$ROOT" push "$REMOTE" "$BRANCH"
fi
