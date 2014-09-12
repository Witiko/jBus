#!/bin/sh
# Removes the debugger object from "$1"

FROM=$( grep -n '^\s*Debugger:\s*$' "$1" | sed 's/:.*//' )
TO=$( grep -n '^\s*// Additional services\s*$' "$1" | sed 's/:.*//' )

COUNT=1
IFS=; cat "$1" | while read -r line || [ -n "$line" ]; do
  if [ $COUNT -lt $FROM ] || [ $COUNT -gt $TO ]; then
    printf "%s\n" "$line"
  fi; COUNT=$(( $COUNT + 1 ))
done | sed 's/return JBus;/return { Scope: JBus.Scope, Node: JBus.Node };/'