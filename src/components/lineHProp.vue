<template>
    <div class="node-prop">
        <div class="title">横线属性</div>
        <div class="field">
            文本
            <input class="input" v-model="modelValue.title" />
        </div>
        <div class="field">
            线条长度
            <input class="input" type="number" v-model="modelValue.width" />
        </div>
        <div class="field">
            线条宽度
            <input class="input" type="number" v-model="modelValue.borderWidth" />
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
            层级
            <input class="input" type="number" v-model="modelValue.zIndex" />
        </div>
        <div class="field">
            线条颜色
            <input class="input" v-model="modelValue.borderColor" />
        </div>
    </div>
</template>
<script setup>
import { ref, defineProps, watch } from "vue";
const props = defineProps({
    modelValue: Object,
});
const handleImage = (event) => {
    const file = event.target.files[0];
    if(!file)return
    const reader = new FileReader();
    reader.onload = function () {
        const base64String = reader.result;
        console.log(base64String);
        props.modelValue.pic = base64String
    };
    reader.readAsDataURL(file);
};
</script>

<style scoped lang="less">
@import url('./propStyle.less');
</style>