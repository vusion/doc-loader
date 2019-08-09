<template>
<div :class="$style.root">
    <div :class="$style.side">
        <u-sidebar :class="$style.sidebar">
            <template v-for="group in groups">
                <template v-if="!group.name">
                    <u-sidebar-item v-for="component in group.children" :key="component.name"
                                    :href="component.href" :to="component.to ? component.to : '/components/' + component.name" :target="component.target">
                        {{ component.CamelName }}
                        <u-label v-if="component.deprecated" style="background: #6c80a1;">废弃</u-label>
                        <u-label v-else-if="component.newest" color="primary">新的</u-label>
                        <small :class="$style.alias">{{ component.alias }}</small>
                    </u-sidebar-item>
                </template>
                <u-sidebar-group v-else :key="group.name" :title="group.name">
                    <u-sidebar-item v-for="component in group.children" :key="component.name"
                                    :href="component.href" :to="component.to ? component.to : '/components/' + component.name" :target="component.target">
                        {{ component.CamelName }}
                        <u-label v-if="component.deprecated" style="background: #6c80a1;">废弃</u-label>
                        <u-label v-else-if="component.newest" color="primary">新的</u-label>
                        <small :class="$style.alias">{{ component.alias }}</small>
                    </u-sidebar-item>
                </u-sidebar-group>
            </template>
        </u-sidebar>
    </div>
    <div :class="$style.main">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return { groups: this.$docs.componentGroups };
    },
};
</script>

<style module>
.side {
    position: fixed;
    width: $sidebar-width;
    top: $navbar-height;
    bottom: 0;
    overflow: hidden;
}

.sidebar {
    padding: 36px 0;
    height: 100%;
    overflow: auto;
    /* width: calc($sidebar-width + 8px); */
}

.alias {
    font-size: 90%;
}

/* .sidebar > * {
    width: $sidebar-width;
} */

.main {
    margin-left: $sidebar-width;
    max-width: 1010px;
    padding-left: 50px;
    padding-bottom: 50px;
    padding-top: 30px;
}
</style>
