#!/bin/sh
# Automagically annotates the "$1" file according to the the "$2" markdown documentation
# If only one argument is passed to the script, then stdin is annotated according to the the "$1" markdown documentation

# Indents the input by $1 spaces
indent() {
  IFS=; while read -r line || [ -n "$line" ]; do
    i=0; while [ "$i" -lt "$1" ]; do
      printf ' '; i=$(( $i + 1 ))
    done; printf "%s\n" "$line"
  done
}

# Wraps the input text in a javadoc comment
javadoc() {
  printf "/**\n";
  IFS=; fold -w 80 -s |
  while read -r line || [ -n "$line" ]; do
    printf " * %s\n" "$line"
  done
  printf " */\n"
}

# Removes $1 levels from markdown headings
removeHeadingLevels() {
  sed 's/^#\{1,'$1'\}//;s/#\{1,'$1'\}$//'
}

# The documentation
DOC=$( eval echo '$'$(echo "$#") )
# The annotation regex
REGEX='\s*//\s*@\s*annotate\s*'
# The total number of lines in the documentation
TOTAL=$( cat "$DOC" | sed -e '$a\' | wc -l )
IFS=;

(if [ $# -lt 2 ]; then
  cat
else
  cat "$1"
fi) | while read -r "line" || [ -n "$line" ]; do
  if printf "%s" "$line" | grep --quiet "$REGEX"; then
    # The number of spaces preceding the regex
    SPACES=$(( $( printf "%s" "$line" | sed 's/[^ ].*//' | wc -c ) ))
    # The starting line of the included section
    FROM=$( grep -F -n '# '"$( printf "%s" "$line" | sed "s#$REGEX##" )" "$DOC" | sed 's/:.*//' )
    # The heading level of the included section
    LEVEL=$(( $( tail -n $(( $TOTAL - $FROM + 1 )) "$DOC" | head -n 1 | sed 's/[^#].*//' | wc -c ) - 1 ))
    # The length of the included section in lines
    LINES=$( tail -n $(( $TOTAL - $FROM )) "$DOC" | grep -n '^#\{1,'$LEVEL'\} ' | head -n 1 | sed 's/:.*//' )
    # We include the entire section as a javadoc comment
    tail -n $(( $TOTAL - $FROM + 1 )) "$DOC" | (
      if [ -z "$LINES" ]; then
        cat # We will print the entire rest of the document
      else
        head -n $LINES # We will print the given number of lines
      fi
    ) | removeHeadingLevels $(( $LEVEL - 1 )) | javadoc | indent $SPACES
  else
    printf "%s\n" "$line"
  fi
done