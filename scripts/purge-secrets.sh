#!/usr/bin/env bash
set -euo pipefail
cat <<'EOF'
SECURITY NOTICE:
This script provides instructions to remove sensitive files from your git history.
It does NOT run destructive operations automatically. Review and run commands manually.

Recommended tools:
1) Install git-filter-repo: https://github.com/newren/git-filter-repo
   pip3 install git-filter-repo

Examples:

# Remove a file from all history:
git filter-repo --path .env --invert-paths

# To replace all occurrences of a secret string in history:
git filter-repo --replace-text replacements.txt
# where replacements.txt contains lines like:
# literal-SECRET==>REDACTED

# Alternatively use BFG Repo-Cleaner:
# java -jar bfg.jar --delete-files .env
# git reflog expire --expire=now --all && git gc --prune=now --aggressive

After cleaning, force-push to remote:
git push origin --force --all
git push origin --force --tags

EOF
