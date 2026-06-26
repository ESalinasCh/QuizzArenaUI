#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Staged-only lint + format check (pre-commit).
#
# Runs ESLint and Prettier scoped to ONLY the staged source files, instead of
# the whole project. Linting/formatting the full tree is slow on slow mounts
# (notably WSL /mnt/c); checking a handful of staged files completes in seconds.
# CI and the pre-push gate still run the full-project lint/format checks.
#
# Invoked as `bash QuizzArenaUI/.husky/lint-staged.sh` (via `just lint-staged`)
# so it does not depend on the file's execute bit, which cannot reliably be set
# on /mnt/c mounts.
# ──────────────────────────────────────────────────────────────────────────────
set -o pipefail

# The Angular app lives in a subdirectory of the repo root.
app_dir="QuizzArenaUI"

# Staged files (Added/Copied/Modified/Renamed), repo-root-relative, restricted
# to source files under the app's src/ tree so we never trip on generated or
# pre-existing unformatted config files.
staged=$(git diff --cached --name-only --diff-filter=ACMR -- "${app_dir}/src/**")

if [ -z "$staged" ]; then
    echo "No staged source files — lint/format check skipped."
    exit 0
fi

# Strip the "<app_dir>/" prefix so paths are relative to the app directory,
# where ESLint/Prettier and their configs live.
eslint_files=""   # *.ts / *.html
prettier_files="" # *.ts / *.html / *.scss / *.css / *.json
while IFS= read -r f; do
    [ -z "$f" ] && continue
    rel="${f#"${app_dir}/"}"
    case "$rel" in
        *.ts|*.html)
            eslint_files="${eslint_files} ${rel}"
            prettier_files="${prettier_files} ${rel}"
            ;;
        *.scss|*.css|*.json)
            prettier_files="${prettier_files} ${rel}"
            ;;
    esac
done <<< "$staged"

rc=0

cd "$app_dir" || exit 1

if [ -n "${eslint_files# }" ]; then
    echo "▶ ESLint (staged):${eslint_files}"
    # shellcheck disable=SC2086  # intentional word-splitting of the file list
    npx eslint ${eslint_files} || rc=$?
else
    echo "▶ ESLint: no staged .ts/.html files"
fi

if [ -n "${prettier_files# }" ]; then
    echo "▶ Prettier --check (staged):${prettier_files}"
    # shellcheck disable=SC2086  # intentional word-splitting of the file list
    npx prettier --check ${prettier_files} || rc=$?
else
    echo "▶ Prettier: no staged formattable files"
fi

if [ $rc -eq 0 ]; then
    echo "✔  staged source files pass ESLint + Prettier"
fi
exit $rc
