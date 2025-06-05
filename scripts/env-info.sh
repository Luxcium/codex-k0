#!/usr/bin/env bash
# env-info.sh - Detect basic environment information
# Usage: ./env-info.sh

set -e
set -o pipefail

is_container() {
    if [ -f /.dockerenv ]; then
        return 0
    fi
    if grep -qE '(docker|lxc|containerd)' /proc/1/cgroup 2>/dev/null; then
        return 0
    fi
    return 1
}

BASE_OS="$(uname -s)"
OS_RELEASE=""
if [ -f /etc/os-release ]; then
    OS_RELEASE="$(. /etc/os-release && echo "$NAME $VERSION")"
fi

if is_container; then
    CONTAINER_STATUS="inside-container"
else
    CONTAINER_STATUS="host-machine"
fi

cat <<INFO
Container Status: $CONTAINER_STATUS
Kernel: $(uname -r)
Base OS: $BASE_OS
OS Release: ${OS_RELEASE:-unknown}
User: $(whoami)
Home Dir: $HOME
PWD: $(pwd)
More detailed hostname information (for systemd-based systems):
$(hostnamectl)
INFO


