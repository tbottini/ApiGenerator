<template>
    <div id="inputSetter">
        <p id="title" class="pres">{{query.attr}}</p>
        <InputDate @change="changeDate" @focus.native="modeEdition = true" />
        <div v-if="modeEdition">
            <Button style="border: none" @click.native="confirm()">Confirm</Button>
            <Button style="border: none" @click.native="reset()">Reset</Button>
        </div>
    </div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler';
import dateLib from '~/assets/dateLib.js';

export default {
    props: {
        date: {
            type: String,
            required: true,
        },
        query: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            currentDate: null,
            saveDate: null,
            modeEdition: false,
        }
    },
    methods: {
        changeDate(date)
        {           
            
            this.saveDate = this.currentDate;
            this.currentDate = date;
            this.modeEdition = true;
        },
        reset()
        {
            this.modeEdition = false;
            this.currentDate = null;
        },
        confirm()
        {
            this.saveDate = this.currentDate;
            this.modeEdition = false;
            if (this.query)
            {
                var stringDate = dateLib.dateToString(this.currentDate);
                apiHandler.set(this.query.apiSection, this.query.id
                , this.query.attr, stringDate)
                .then(r => {
                    
                    r = r.data;
                    this.$emit('update', r);
                    if (!r.error)
                        r.msg = "date update succefuly";
                    this.$store.commit('setMsgApi', r);
                })
            }
        },
    }
}
</script>
<style>
#btns
{
    display: flex;
    flex-direction: row;
}

.pres
{
    font-size: 1.6em;
    font-weight: 100;
    margin: 6px 0;
    text-transform: capitalize;
}

#inputSetter
{
    margin: 30px auto;
}
</style>