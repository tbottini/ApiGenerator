<template>
    <div class="booleanSetter">
        <p id="title" class="pres">
            {{ query.namePrint }}
        </p>
        <ToggleButton ref="toggle" v-model="currentState" >
        </ToggleButton>
    </div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler.js';

export default {
    props: {
        query: {

        },
        init: {

        }
    },
    data()
    {
        return {
            currentState: this.init,
        }
    },
    watch: {
        init()
        {
            this.currentState = this.init == 1;
		},
		currentState()
		{
			this.confirm();
		}
	},
    methods: {
        confirm()
        {
            apiHandler.setAttr(this.query, this.currentState)
            .then(r =>
            {
                this.$emit('update', r.data);
            })
        }
    }
}
</script>
<style scoped>
.booleanSetter
{
	background-color: white;
	padding: 6px;
	border-radius: 4px;
}
</style>