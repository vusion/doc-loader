<template>
<div><slot></slot></div>
</template>
<script>
export default {
    name: 'u-code-example-demo',
    data() {
        return {
            anondemoVM: undefined,
        };
    },
    methods: {
        flush() {
            if (!this.anondemoVM)
                return;
            const $data = this.anondemoVM.$data;
            const data = {};

            Object.keys($data).forEach((key) => {
                if (key !== 'codeExampleDemoVM')
                    data[key] = $data[key];
            });
            this.$parent.anondemoData = data;
        },
        logEvent(...args) {
            this.$parent.logEvent(...args);
        },
    },
};
</script>
