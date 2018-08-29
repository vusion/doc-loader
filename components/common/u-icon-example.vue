<template>
<div :class="$style.root">
    <div :class="$style.icon">
        <slot></slot>
    </div>
    <div :class="$style.title">{{ title }}</div>
</div>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>

<style module>
.root {
    display: inline-block;
    width: 120px;
    vertical-align: top;
    text-align: center;
    margin-top: 5px;
    margin-right: 10px;
    margin-bottom: 15px;
    border: 1px solid transparent;
    border-radius: 3px;
}

.root:hover {
    border-color: #e9eef5;
    box-shadow: 0 2px 10px rgba(90,95,100,0.12);
}

.icon {
    font-size: 32px;
    padding: 4px;
    padding-bottom: 0;
}

.title {
    font-size: 12px;
    padding: 4px;
    color: #a3adbb;
}

.root:hover .title {
    color: inherit;
}
</style>
