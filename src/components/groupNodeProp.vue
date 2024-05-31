<template>
    <div class="node-prop">
        <div class="title">节点组合属性(慎改)</div>
        <div class="field">
            字体大小
            <input class="input" type="number" v-model="modelValue.fontSize" />
        </div>
        <div class="field">
            字体加粗
            <input class="input" type="checkbox" v-model="modelValue.fontWeightBold" />
        </div>
        <div class="field">
            行高
            <input class="input" type="number" v-model="modelValue.fontLineHeight" />
        </div>
        <div class="field">
            文本对齐方式
            <input id="type" type="text" list="typelist" placeholder="请选择" v-model="modelValue.fontTextAlign">
            <datalist id="typelist">
                <option value="left">居左</option>
                <option value="center">居中</option>
                <option value="right">居右</option>
                <option value="justify">两边对齐</option>
            </datalist>
        </div>
        <div class="field">
            宽度
            <input class="input" type="number" v-model="modelValue.width" />
        </div>
        <div class="field">
            高度
            <input class="input" type="number" v-model="modelValue.height" />
        </div>
        <div class="field">
            位置X
            <input class="input" type="number" v-model="modelValue.x" />
        </div>
        <div class="field">
            位置Y
            <input class="input" type="number" v-model="modelValue.y" />
        </div>
        <div class="field">
            节点内边距
            <input class="input" type="number" v-model="modelValue.nodePadding" />
        </div>
        <div class="field">
            节点层级
            <input class="input" type="number" v-model="modelValue.zIndex" />
        </div>
        <div class="field">
            是否有边框
            <input class="input" type="checkbox" v-model="modelValue.isBorder" />
        </div>
        <div class="field">
            边框宽度
            <input class="input" type="number" v-model="modelValue.borderWidth" />
        </div>
        <div class="field">
            边框颜色
            <input class="input"  v-model="modelValue.borderColor"/>
        </div>
        <!-- <div class="field">
            整体横向移动
            <input class="input" type="number" v-model="modelValue.moveX" />
        </div>
        <div class="field">
            整体纵向移动
            <input class="input" type="number" v-model="modelValue.moveY" />
        </div> -->
        <div class="field">
            <button @click="$emit('fllowSet','column')"> 纵向无缝跟随</button>
        </div>
        <div class="field">
            <button @click="$emit('fllowSet','row')">横向无缝跟随</button>
        </div>
    </div>
</template>
<script setup>
import { defineProps} from "vue";
const props = defineProps({
    modelValue:Object
})
</script>

<style scoped lang="less">
@import url('./propStyle.less');
</style>