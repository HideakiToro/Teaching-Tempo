<template>
    <NavBar title="Profile" disableProfile="true" />
    <div class="Content" v-if="showContent">
        <div class="Card">
            <div class="username">{{ username }}</div>
            <NavBtn @click="ChangePassword(true)">Change Password</NavBtn>
            <NavBtn @click="Delete">Delete Account</NavBtn>
            <NavBtn @click="Logout">Logout</NavBtn>
        </div>
        <div v-if="wronglogin" class="error">
            {{ msg }}
        </div>
    </div>
    <div class="changePasswordBG" v-if="showChangePassword">
        <div class="Card">
            <div class="username">Change Password</div>
            <input type="password" placeholder="Password" v-model="password" />
            <input type="password" placeholder="Repeat Password" v-model="repeat" />
            <div>
                <button class="smallButton" style="margin-right: 12.5pt" @click="ChangePassword(false)">
                    Cancel
                </button>
                <button class="smallButton" style="margin-left: 12.5pt" @click="ApplyPassword">
                    Change
                </button>
            </div>
        </div>
        <div v-if="wronglogin" class="error">
            {{ msg }}
        </div>
    </div>
</template>

<script>
import { handleError } from 'vue';
import checkAuth from '~/utils/authentication';
import getCookies from '~/utils/getCookies';

export default {
    data() {
        return {
            showContent: false,
            cookies: getCookies(),
            wronglogin: false,
            username: "",
            showChangePassword: false,
            password: "",
            repeat: ""
        }
    },
    async beforeMount() {
        let res = await checkAuth();
        if (res === true) {
            this.showContent = true;
        } else {
            navigateTo("/");
        }
    },
    mounted() {
        $fetch("/api/user?session=" + this.cookies["Session"])
            .then(res => {
                if (res.message == "User Found") {
                    this.username = res.name;
                } else {
                    this.wronglogin = true;
                    this.msg = "Something went wrong."
                }
            }).catch(e => handleError(e))
    },
    methods: {
        Logout() {
            document.cookie = "Session=" + this.cookies["Session"] + "; path=/" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
            navigateTo("/");
        },
        Delete() {
            $fetch("/api/user", {
                method: "DELETE",
                body: {
                    session: this.cookies["Session"]
                }
            }).then(res => {
                if (res.message == "User deleted") {
                    this.Logout();
                } else {
                    this.wronglogin = true;
                    this.msg = "Something went wrong."
                }
            }).catch(e => handleError(e))
        },
        handleError(e) {
            this.wronglogin = true;
            switch (e.response.status) {
                case 500:
                    this.msg = "Server is not working correctly.";
                    break;
                case 404:
                    this.msg = "Username or Session not found.";
                    this.Logout();
                    break;
                case 403:
                    this.msg = "Session shouldn't be empty.";
                    this.Logout();
                    break;
                default:
                    this.msg = "Something went wrong.";
                    break;
            }
        },
        ChangePassword(show) {
            this.showChangePassword = show;
            this.password = "";
            this.repeat = "";
            this.wronglogin = false;
        },
        ApplyPassword() {
            if (this.password == this.repeat) {
                $fetch("/api/user", {
                    method: "PATCH",
                    body: {
                        session: this.cookies["Session"],
                        pass: this.password
                    }
                }).then(res => {
                    if (res.message == "Password Changed") {
                        this.ChangePassword(false);
                        this.msg = "Password Changed Successfully."
                        this.wronglogin = true;
                    } else {
                        this.wronglogin = true;
                        this.msg = "Something went wrong."
                    }
                }).catch(e => handleError(e))
            } else {
                this.wronglogin = true;
                this.msg = "The Passwords are different.";
            }
        }
    }
}
</script>

<style>
.Card {
    background-color: rgb(48, 48, 48);
    width: 300pt;
    height: 300pt;
    border-radius: 25pt;
    align-content: center;
    margin-left: calc(50vw - 150pt);
    margin-top: calc(50vh - 150pt);
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

.username {
    width: 100%;
    font-size: 25pt;
    text-align: center;
    margin-bottom: 5pt;
    overflow: auto;
    white-space: nowrap;
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

.changePasswordBG {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
</style>