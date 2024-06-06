<template>
    <span class="material-symbols-outlined" :class="{ active: isToggled }" @click="$emit('toggle')"><slot /></span>
</template>

<style scoped>
span {
    width: 80pt;
    height: 80pt;
    background: radial-gradient(circle at center, rgb(192,192,192), white);
    margin-left: 5pt;
    margin-right: 5pt;
    border-radius: 15pt;
    text-align: center;
    align-content: center;
    font-size: 50pt;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

span:hover {
    background: radial-gradient(circle at center, rgb(192, 192, 128), yellow);
}

span:active {
    background: radial-gradient(circle at center, rgb(128, 196, 128), green);
}

.active {
    background: radial-gradient(circle at center, rgb(128, 196, 128), green);
}

.active:hover {
    background: radial-gradient(circle at center, rgb(128, 196, 128), green);
}

.active:active {
    background: radial-gradient(circle at center, rgb(128, 196, 128), green);
}
</style>

<script setup>
const { isToggled } = defineProps(['isToggled']);
</script>