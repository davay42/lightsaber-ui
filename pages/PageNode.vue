<script setup>

import { EditorComponent, useBaklava } from "baklavajs";
import "@baklavajs/themes/dist/syrup-dark.css";

import { defineNode, NodeInterface, NumberInterface, SelectInterface } from "baklavajs";

const MyNode = defineNode({
  type: "MyNode",
  inputs: {
    number1: () => new NumberInterface("Number", 1),
    number2: () => new NumberInterface("Number", 10),
    operation: () => new SelectInterface("Operation", "Add", ["Add", "Subtract"]).setPort(false),
  },
  outputs: {
    output: () => new NodeInterface("Output", 0),
  },
});

const baklava = useBaklava();
baklava.editor.registerNodeType(MyNode);

</script>

<template lang='pug'>
.h-100dvh
  EditorComponent(:view-model="baklava")
</template>


https://v2.baklava.tech/getting-started.html