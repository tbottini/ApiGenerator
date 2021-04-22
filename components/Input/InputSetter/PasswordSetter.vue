<template>
    <div class="inputSetter">
        <InputText v-model="currentPassword" :hidden="true">Mot de Passe Actuel</InputText>
        <InputText v-model="newPassword" :hidden="true">Nouveau Mot de Passe</InputText>
        <Button @click.native="changePassword"><icon :icon="['fas', 'edit']" /></Button>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        url: {
            
        }
    },
    data() {
        return {
            currentPassword: '',
            newPassword: '',
        }
    },
    methods: {
        changePassword()
        {
            axios.post('/api/users/changePassword', {
                oldPassword: this.currentPassword,
                newPassword: this.newPassword
            }).then((res) =>
            {
                this.$store.commit('setMsgApi', res.data);
            })
            this.currentPassword = '';
            this.newPassword = '';
        }
    }
}
</script>
<style lang="sass" scoped>
@import '~/assets/manage'

</style>