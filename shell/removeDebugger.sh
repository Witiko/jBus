#!/bin/sh
# Removes the debugger object from "$1"

sed 's/return JBus;/return { Scope: JBus.Scope, Node: JBus.Node };/;s/^\(})(\)true\();\)$/\1false\2/' "$1"