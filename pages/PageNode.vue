<script setup>

import { EditorComponent, useBaklava } from "baklavajs";
import "@baklavajs/themes/dist/syrup-dark.css";

import { defineNode, NodeInterface, NumberInterface, SelectInterface } from "baklavajs";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

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

const presets = useStorage('baklava-presets', {})

const presetName = ref()

const json = ref()


function save(preset) {
  if (!preset) return
  presets.value[preset] = baklava.editor.save()
}

function load(preset) {
  baklava.editor.load(presets.value[preset])
}



</script>

<template lang='pug'>
.h-100dvh
  .flex.flex-wrap.gap-2.p-1
    input.bg-dark-400.p-2.w-30.rounded(v-model="presetName")
    button.p-2(:disabled="!presetName" :class="{'op-50':!presetName}" @click="save(presetName)") Save Preset
    button.p-2.flex.items-center.gap-2(
      @click="load(p)"
      v-for="(preset,p) in presets" :key="preset") {{ p }}
      .i-la-times(@click.prevent.stop="delete presets[p]")
  EditorComponent(:view-model="baklava")
  .flex.flex-col.gap-4
    .flex.gap-4
      button.p-4(@click="json = baklava.editor.save()") TO JSON
      button.p-4(@click="json = ''") CLEAR
    pre.p-4.text-xs {{ json }}
</template>


https://v2.baklava.tech/getting-started.html