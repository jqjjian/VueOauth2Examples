<template>
    <div class="mt-grids">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'grid',
    props: {
        cols: {
            type: Number
        }
    },
    data () {
        return {
            childrenSize: 3
        };
    },
    computed: {
        column () {
            return this.cols || this.childrenSize;
        }
    },
    methods: {
        countColumn () {
            this.childrenSize = this.$children.length;
        }
    }
};
</script>

<style lang="postcss">
@import './grid.css';
</style>
