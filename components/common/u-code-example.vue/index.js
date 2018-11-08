import '../atom-one-light.css';

export default {
    name: 'u-code-example',
    props: {
        title: { type: String, default: 'EXAMPLE' },
        showCode: { type: Boolean, default: false },
        showDetail: { type: Boolean, default: false },
        // disableDetail: { type: Boolean, default: false },
        filePath: String,
    },
    data() {
        let baseLink = this.$docs.github;
        if (baseLink) {
            let branch = 'master';
            if (baseLink.includes('#')) {
                const arr = baseLink.split('#');
                baseLink = arr[0];
                branch = arr[1];
            }
            baseLink = baseLink.replace(/\/$/, '') + '/tree/' + branch;
        }

        return {
            currentShowCode: this.showCode,
            currentShowDetail: this.showDetail,
            githubLink: baseLink ? baseLink + '/' + this.filePath : false,
            anondemoData: {},
            logs: [],
        };
    },
    watch: {
        showCode(showCode) {
            this.currentShowCode = showCode;
        },
        showDetail(showDetail) {
            this.currentShowDetail = showDetail;
        },
    },
    methods: {
        toggleShowCode() {
            this.currentShowCode = !this.currentShowCode;
            this.$emit('update:showCode', this.currentShowCode);
        },
        toggleShowDetail() {
            // if (this.disableDetail)
            //     return;
            this.currentShowDetail = !this.currentShowDetail;
            this.$emit('update:showDetail', this.currentShowDetail);
        },
        logEvent(vm, eventName, payload) {
            if (!this.currentShowDetail)
                return;

            if (this.logs.length >= 100)
                this.logs.shift();
            this.logs.push({
                type: 'event',
                eventName,
                sender: vm.$options.name,
                time: new Date().toTimeString().split(' ')[0],
            });
            this.$nextTick(() => {
                this.$refs.log && (this.$refs.log.scrollTop = this.$refs.log.scrollHeight);
            });
        },
        clearLogs() {
            this.logs = [];
        },
    },
};
