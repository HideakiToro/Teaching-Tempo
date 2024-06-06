<template>
    <NavBar title="Sessions" disableSessions="true"/>
    <div class="Content" v-if="showContent">
        <NavBtn class="NavBtn" v-for="(item, index) in sessions" @click="navigateTo('/sessions/' + item.session)">
            {{ item.name }}
        </NavBtn>
    </div>
    <span class="material-symbols-outlined AddBtn" @click="Add()">add</span>
    <div class="AddContainer" v-if="showAdd">
        <div class="AddBackground" @click="closeMenu()" />
        <div class="AddWindow">
            <input class="AddName" type="text" v-model="sessionName" placeholder="Enter a name"/>
            <div class="AddConfirm" @click="Confirm()">
                Create
            </div>
            <span class="material-symbols-outlined CloseMenuBtn" @click="closeMenu()">close</span>
        </div>
    </div>
</template>

<script>
import checkAuth from '~/utils/authentication';
import getCookies from '~/utils/getCookies';
export default {
    data() {
        return {
            showContent: false,
            sessions: [],
            showAdd: false,
            sessionName: "",
            cookies: getCookies()
        }
    },
    async beforeMount() {
        let res = await checkAuth();
        if(res === true){
            await this.loadContent();

            this.showContent = true;
        }else{
            navigateTo("/");
        }
    },
    methods: {
        async loadContent() {
            let res = await $fetch("/api/sessions/list");
            res.sessions.forEach(session => {
                this.sessions.push(JSON.parse(session));
            });
        },
        Add() {
            this.showAdd = true;
        },
        closeMenu() {
            this.showAdd = false;
            this.sessionName = "";
        },
        Confirm() {
            $fetch("/api/sessions/add", {
                method: "POST",
                body: {
                    session: this.cookies["Session"],
                    name: this.sessionName
                }
            }).then(res => {
                navigateTo("/sessions/" + res.session)
            })
        }
    }
}
</script>

<style scoped>
.NavBtn {
    background-color: rgb(48, 48, 48);
    overflow: auto;
    white-space: nowrap;
}

.NavBtn:active {
    background-color: rgb(96, 96, 96);
}

.NavBtn:hover {
    background-color: rgb(16, 16, 16);
}

.AddBtn {
    position: fixed;
    font-size: 40pt;
    top: 5pt;
    right: 10pt;
    z-index: 3;
    color: white;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background-color: rgb(96, 96, 96);
    border-radius: 20pt;
}

.AddBtn:hover {
    background-color: rgb(32, 32, 32);
}

.AddBtn:active {
    background-color: rgb(124, 124, 124);
}

.AddContainer {
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    z-index: 4;
}

.AddBackground {
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 4;
}

.AddWindow {
    position: fixed;
    z-index: 5;
    width: 300pt;
    left: calc(50vw - 150pt);
    top: 25vh;
    height: 50vh;
    background-color: rgb(32, 32, 32);
    border-radius: 15pt;
    min-height: 90pt;
}

.AddName {
    width: 85%;
    padding-left: 2.5%;
    padding-right: 2.5%;
    height: 40pt;
    border: none;
    border-radius: 20pt;
    margin-top: calc(25vh - 45pt);
    margin-left: 5%;
    background-color: rgb(96, 96, 96);
    color: white;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
}

.AddConfirm {
    width: 85%;
    padding-left: 2.5%;
    padding-right: 2.5%;
    height: 40pt;
    border: none;
    border-radius: 20pt;
    margin-top: 10pt;
    margin-left: 5%;
    background-color: rgb(96, 96, 96);
    align-content: center;
    text-align: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

.AddConfirm:hover {
    background-color: rgb(48, 48, 48);
}

.AddConfirm:active {
    background-color: rgb(124, 124, 124);
}

.CloseMenuBtn {
    font-size: 30pt;
    position: fixed;
    top: 27vh;
    left: calc(50vw - 150pt + 250pt);
    width: 30pt;
    height: 30pt;
    color: white;
    z-index: 4;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
</style>