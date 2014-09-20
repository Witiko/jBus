#!/bin/sh
# Automagically includes any required files to the stdin

# Indents the input by $1 spaces
indent() {
  IFS=; while read -r line || [ -n "$line" ]; do
    i=0; while [ "$i" -lt "$1" ]; do
      printf ' '; i=$(( $i + 1 ))
    done; printf "%s\n" "$line"
  done
}

REGEX='\s*//\s*@\s*include\s*'
IFS=; while read -r "line" || [ -n "$line" ]; do
  if printf "%s" "$line" | grep --quiet "$REGEX"; then
    SPACES=$(( $( printf "%s" "$line" | sed 's/[^ ].*//' | wc -c ) ))
    cat src/"$( printf "%s" "$line" | sed "s#$REGEX##" )".js | indent $SPACES
  else
    printf "%s\n" "$line"
  fi
done