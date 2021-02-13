<template>
    <div :style="style">{{data}}</div>
</template>
<script>
const TIME_DELETE = 1500;

export default {
    //comment réagir à un changement de
    //la part de vuex
    mounted () {
        this.$store.watch(this.$store.getters.msgApi,
        msg => {
            if (!msg)
                msg = "";
            this.idMsg++;
            var idMsg = this.idMsg
            setTimeout(() => {
                //if a new message arrives before
                //the last one is deleted
                //we delete the last one by checking its id
                if (this.idMsg == idMsg)
                {
                    this.data = "";
                    this.active = false;
                }
            }, TIME_DELETE);
            this.data = msg;
            this.active = true;
            if (msg.error)
            {
                this.isError = true;
                this.data = msg.error;
            }
            else
            {
                this.isError = false;
                this.data = msg.msg;
            }
        })
    },
    data()
    {
        return {
            data: "",
            active: false,
            isError: false,
            idMsg: 0
        }
    },
    computed: {
        style() {
            return {
                "color": this.isError ? "darkred" : "lightgreen",
                'border-bottom': `solid ${this.isError ? "darkred" : "lightgreen"} 2px`,
                "opacity": this.active ? "0.95" : "0",
                "display": this.data ? "" : "none"
            }
        },
    
    }
}
</script>
<style scoped>

div
{
    position: fixed;
    bottom: 5%;
    left: 30%;
    right: 30%;
    width: 40%;
    color: white;
    border-radius: 10px;
    border-bottom: solid white 2px;
    font-size: 1.5em;
    text-align: center;
    padding: 10px;
    opacity: 0.95;
    background-color: #ffffffff;
    transition: 0.2s ease;
    z-index: 70;
}

</style>