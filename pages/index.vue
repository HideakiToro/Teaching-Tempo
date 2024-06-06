<template>
    <div class="Card">
        <div>
            <input type="text" placeholder="Username" v-model="username" />
        </div>
        <div>
            <input type="password" placeholder="Password" v-model="password" />
        </div>
        <NavBtn @click="Login">Login</NavBtn>
        <div>
            <button class="smallButton" style="margin-right: 12.5pt" @click="Register">
                Register
            </button>
            <button class="smallButton" style="margin-left: 12.5pt" @click="Help">
                Help
            </button>
        </div>
    </div>
    <div v-if="wronglogin" class="error">
        {{ msg }}
    </div>
</template>

<style scoped>
.Card {
    background-color: rgb(48, 48, 48);
    width: 300pt;
    height: 300pt;
    border-radius: 25pt;
    margin-left: calc(50vw - 150pt);
    margin-top: calc(50vh - 150pt);
    align-content: center;
}

input {
    width: 80%;
    height: 50pt;
    border: none;
    border-radius: 15pt;
    margin: 10pt;
    margin-left: 5%;
    padding-left: 5%;
    padding-right: 5%;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
}

.error {
    text-align: center;
}

.smallButton {
    width: 40%;
    height: 25pt;
    border: none;
    border-radius: 15pt;
    margin: 10pt;
    margin-left: 5%;
    padding-left: 5%;
    padding-right: 5%;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    background-color: gray;
    color: inherit;
}

.smallButton:hover {
    background-color: rgb(160, 160, 160);
}

.smallButton:active {
    background-color: rgb(96, 96, 96);
}
</style>

<script>
import * as CryptoJS from 'crypto-js';
import checkAuth from '~/utils/authentication';

export default {
    data() {
        return {
            username: "",
            password: "",
            session: "",
            key: "",
            wronglogin: false,
            msg: ""
        }
    },
    async beforeMount() {
        let res = await checkAuth();
        if(res === true){
            navigateTo("/sessions");
        }else{
            $fetch("/api/user/login").then(res => {
                this.session = res.session;
                this.key = res.key;
            });
        }
    },
    methods: {
        Login() {
            this.wrongLogin = false;

            const encrypted = CryptoJS.AES.encrypt(this.password, this.key).toString();

            $fetch("/api/user/login", {
                method: "POST",
                body: {
                    "username": this.username,
                    "pass": encrypted,
                    "session": this.session
                }
            }).then(res => {
                document.cookie = "Session=" + this.session + "; path=/"
                navigateTo("/sessions");
            }).catch(e => {
                console.log(e);
                this.wronglogin = true;
                this.msg = "The input data is wrong.";
            })
        },
        Register() {
            navigateTo("/register")
        },
        Help(){
            this.wronglogin = true;
            this.msg = "If you forgot your password, we currently have no way of helping you.";
        }
    }
}
</script>