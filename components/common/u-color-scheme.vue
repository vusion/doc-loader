<template>
<div :class="$style.root" :style="{ background: value }">
    <slot></slot>
    <div :class="$style.name">{{ name }}</div>
</div>
</template>

<script>
export default {
    name: 'u-color-scheme',
    props: {
        name: String,
        value: String,
    },
};
</script>

<style module>
.root {
    position: relative;
    height: 80px;
}

.name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.4);
    font-size: 12px;
    color: white;
    padding: 2px 4px;
    /* opacity: 0; */
    transition: opacity $transition-duration-base;
}

.root:hover .name {
    opacity: 1;
}
</style>
