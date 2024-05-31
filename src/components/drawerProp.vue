<template>
    <div class="node-prop">
        <div class="title">画布属性</div>
        <div class="field">
            画布宽度
            <input class="input" type="number" v-model="modelValue.drawerWidth" />
        </div>
        <div class="field">
            画布高度
            <input class="input" type="number" v-model="modelValue.drawerHeight" />
        </div>
        <div class="field">
            缩放比例
            <input class="input" type="number" v-model="modelValue.drawerScale" />
        </div>
        <div class="field">
            是否有边框
            <input class="input" type="checkbox" v-model="modelValue.isBorder" />
        </div>
        <div class="field">
            边框宽度
            <input class="input" type="number"  v-model="modelValue.borderWidth" />
        </div>
        <div class="field">
            边框颜色
            <input class="input"  v-model="modelValue.borderColor"/>
        </div>
        <div class="field">
            圆角大小
            <input class="input" type="number"  v-model="modelValue.borderRadius"/>
        </div>
        <div class="field">
            内边距
            <input class="input" type="number"  v-model="modelValue.drawerPadding"/>
        </div>
        <div class="field">
            外边距
            <input class="input"  type="number" v-model="modelValue.drawerMargin"/>
        </div>
        <div class="field">
            背景色
            <input class="input"  v-model="modelValue.drawerBgColor"/>
        </div>
    </div>
</template>
<script setup>

import { ref ,defineProps,defineEmits} from "vue";
const props = defineProps({
    modelValue:Object
})
</script>
<style scoped lang="less">
@import url('./propStyle.less');
</style>