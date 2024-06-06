<template>
    <div class="Card">
        <div>
            <input type="text" placeholder="Username" v-model="username" />
        </div>
        <div>
            <input type="password" placeholder="Password" v-model="password" />
        </div>
        <div>
            <input type="password" placeholder="Repeat Password" v-model="repeat" />
        </div>
        <NavBtn @click="Register">Register</NavBtn>
    </div>
    <div v-if="wronglogin" class="error">
        {{ msg }}
    </div>
</template>

<style>
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
</style>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            repeat: "",
            wronglogin: false,
            msg: ""
        }
    },
    methods: {
        Register() {
            if (this.password == this.repeat) {
                $fetch("/api/user/register", {
                    method: "POST",
                    body: {
                        name: this.username,
                        password: this.password
                    }
                }).then(res => {
                    console.log(res);
                    if (res.message == "User created") {
                        navigateTo("/");
                    } else {
                        this.wronglogin = true;
                        this.msg = "Something went wrong."
                    }
                }).catch(e => {
                    this.wronglogin = true;
                    switch (e.response.status) {
                        case 500:
                            this.msg = "Server is not working correctly.";
                            break;
                        case 403:
                            this.msg = "Username shouldn't be empty.";
                            break;
                        case 401:
                            this.msg = "Username already in use.";
                            break;
                        default:
                            this.msg = "Something went wrong.";
                            break;
                    }
                })
            } else {
                this.wronglogin = true;
                this.msg = "The Passwords are different.";
            }
        }
    }
}
</script>