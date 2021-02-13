<template>
    <div>
        <InputText v-model="currentPassword" :hidden="true">Current Password</InputText>
        <InputText v-model="newPassword" :hidden="true">New Password</InputText>
        <Button @click.native="changePassword">Change Password</Button>
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
<style>
</style>