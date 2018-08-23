<template>
<header :class="$style.head">
    <div :class="$style.wrap">
        <u-navbar>
            <the-logo slot="left"></the-logo>
            <u-navbar-item to="/components">组件</u-navbar-item>
        </u-navbar>
    </div>
</header>
</template>
<script>
export default {
    name: 'the-header',
};
</script>
<style module>
.head {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 64px;
    background: #fff;
    box-shadow: 0 3px 4px rgba(0,0,0,0.1);
    z-index: 10000;
}

.wrap {
    width: 1180px;
    margin: 0 auto;
}
</style>
