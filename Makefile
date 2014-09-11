.POSIX:

FLAGS=--language_in ECMASCRIPT3 --charset UTF8

all: build min
build: build/jBus.js build/jBus.debug.js
min: build/jBus.min.js build/jBus.debug.min.js

build/jBus.js: src/framework.js src/jBus.js docs/api.md src/license.js
	( cat src/license.js; printf '\n\n'; shell/removeDebugger.sh src/jBus.js | shell/annotate.sh - docs/api.md | shell/include.sh ) > $@

build/jBus.debug.js: src/framework.js src/jBus.js docs/api.md src/license.js
	( cat src/license.js; printf '\n\n'; shell/annotate.sh src/jBus.js docs/api.md | shell/include.sh ) > $@

build/%.min.js: build/%.js
	( cat src/license.js; printf '\n'; closure-compiler $(FLAGS) --js $< ) > $@

clean:
	rm build/jBus*.js