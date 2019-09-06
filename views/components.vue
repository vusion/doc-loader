<template>
<l-side-main>
    <u-sidebar slot="side" :class="$style.sidebar">
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
    <router-view></router-view>
</l-side-main>
</template>

<script>
export default {
    data() {
        return { groups: this.$docs.componentGroups };
    },
};
</script>

<style module>
.sidebar[class] {
    padding: 36px 0;
}

.alias {
    font-size: 90%;
}
</style>
