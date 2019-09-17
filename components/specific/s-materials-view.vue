<template>
<l-side-main>
    <u-sidebar slot="side" :class="$style.sidebar" :size="sidebarSize">
        <template v-for="group in groups">
            <template v-if="!group.name">
                <u-sidebar-item v-for="material in group.children" :key="material.name"
                                :href="material.href" :to="material.to ? material.to : `/${type}/` + material.name" :target="material.target">
                    {{ material.CamelName }}
                    <u-label v-if="material.deprecated" style="background: #6c80a1;">废弃</u-label>
                    <u-label v-else-if="material.newest" color="primary">新的</u-label>
                    <small :class="$style.alias">{{ material.alias }}</small>
                </u-sidebar-item>
            </template>
            <u-sidebar-group v-else :key="group.name" :title="group.name">
                <u-sidebar-item v-for="material in group.children" :key="material.name"
                                :href="material.href" :to="material.to ? material.to : `/${type}/` + material.name" :target="material.target">
                    {{ material.CamelName }}
                    <u-label v-if="material.deprecated" style="background: #6c80a1;">废弃</u-label>
                    <u-label v-else-if="material.newest" color="primary">新的</u-label>
                    <small :class="$style.alias">{{ material.alias }}</small>
                </u-sidebar-item>
            </u-sidebar-group>
        </template>
    </u-sidebar>
    <router-view></router-view>
</l-side-main>
</template>

<script>
export default {
    name: 's-materials-view',
    props: {
        type: { type: String, default: 'components' },
        groups: Array,
        sidebarSize: String,
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
