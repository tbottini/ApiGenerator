<template>
  <div class="login">
    <template v-if="!forgot">
      <h3 class="">{{ title }}</h3>
      <p class="input-p">
        <label>E-MAIL</label
        ><Mail @change="setMail" :mail="email" class="mail" />
      </p>
      <p class="input-p">
        <label>MOT DE PASSE</label><input v-model="password" type="password" />
      </p>
      <button @click="login" class="login-button log">SE CONNECTER</button>
      <p @click="forgot = true" class="link">
        Vous avez oublié votre mot de passe ?
      </p>
      <p class="error">{{ error }}</p>
      <p class="register-section">
        <label class="info">VOUS N’AVEZ PAS ENCORE DE COMPTE ?</label
        ><nuxt-link to="inscription" class="login-button register"
          >CRÉER SON COMPTE</nuxt-link
        >
      </p>
    </template>
    <template v-else>
      <h3>Récupération de mot de passe</h3>
      <p v-if="!mailSend">
        Nous vous enverrons un mail à l'adresse indiqué pour réinitialiser votre
        mot de passe
      </p>
      <p v-else>
        Si un compte est enregistré avec cette adresse un mail vous a
        correctement été envoyé
      </p>
      <p v-if="!mailSend" class="input-p">
        <label>E-MAIL</label
        ><Mail @change="setMail" :mail="email" class="mail" />
      </p>
      <div v-if="!mailSend" style="width: 40%">
        <ThemeButton
          @click.native="resetPasswordMail"
          class="button3 bold button-hover mt-3"
          >Envoyer le Mail</ThemeButton
        >
      </div>
      <BackButton
        to="/profil"
        @click.native="forgot = false"
        class="mt-6"
        style="margin: 0"
      >
        RETOUR À LA CONNEXION
      </BackButton>
    </template>
  </div>
</template>
<script>
import apiHandler from "~/assets/class/apiHandler";

export default {
  props: {
    title: {
      type: String,
      default: "CONNECTEZ-VOUS"
    }
  },
  data() {
    return {
      email: "",
      password: "",
      error: "",
      forgot: false,
      mailSend: false
    };
  },
  methods: {
    login() {
      apiHandler
        .postForm(
          "users/login",
          {
            email: this.email,
            password: this.password
          },
          true
        )
        .then(r => {
          console.log(r.data);
          console.log("login");
          if (!r.data.error) {
            this.$store.commit("login", r.data);
            this.$emit("login", r.data);
          } else {
            this.error =
              "L'identifiant et le Mot de passe ne correspondent pas";
          }
        });
    },
    resetPasswordMail() {
      this.$axios
        .post("/api/users/reinit-mail", {
          email: this.email
        })
        .then(d => {
          this.mailSend = true;
        });
    },
    setMail(mail) {
      this.email = mail;
    }
  }
};
</script>
<style lang="sass" scoped>
@import 'assets/editions'
.login
    background-color: #FFF9F1
    padding-left: 6rem;
    padding-right: 2rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;

p
    margin-bottom: 0.6rem
    margin-top: 0.6rem
    white-space: nowrap;

h3
    font-size: 1.5rem !important
    margin-bottom: 1.5rem;
    color: $color2
    font-family: $font

.mail, input
    margin-left: 0.6rem;
    margin-right: 0.6rem;
    width: 100%

label
    color: $color1;

input
    border: none

input:focus-visible
    color: $color1
    border: 0.5px solid $color1


label, input
    font-size: 1.5rem

button
    cursor: pointer

.login-button
    border: none
    color: white
    font-family: $font
    background-color: $color4
    font-size: 1.3rem;
    padding: 0.15rem;
    padding-left: 1rem;
    padding-right: 1rem;

.login-button:hover
  color: $color3;

.info
    font-size: 1.15rem;
    color: $color2 !important
    font-family: $font
    display: flex;

.input-p
    display: flex

.log
    display: block
    margin-left: auto;
    width: 15rem;
    margin-right: 3rem;
    padding-top: 0.3rem

.register
    height: 2rem;
    margin-left: auto
    width: 18rem;

.register-section
    margin-top: 3rem;
    display: flex

.error
  color: red
  font-family: $fontLight;
  font-size: 1.3rem


a
    text-align: center

.link
  cursor: pointer;
.link:hover
  color: $color1;
</style>
