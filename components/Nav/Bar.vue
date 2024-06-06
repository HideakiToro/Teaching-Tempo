<template>
    <div class="NavBar">
        <span class="material-symbols-outlined OpenMenuBtn" @click="openMenu()">menu</span>
        <div class="Title">{{ title }}</div>
        <slot />
    </div>
    <div class="ScreenDarken" v-if="isMenuOpen" @click="closeMenu()" />
    <div class="MenuBar" v-if="isMenuOpen">
        <span class="material-symbols-outlined CloseMenuBtn" @click="closeMenu()">close</span>
        <div class="NavBtnContainer">
            <NavBtn @click="navigateTo('/sessions')" v-if="!disableSessions">Sessions</NavBtn>
            <NavBtn @click="navigateTo('/profile')"  v-if="!disableProfile">Profile</NavBtn>
        </div>
        <div class="MenuTitle">
            Teaching Tempo
        </div>
    </div>
</template>

<style scoped>
.NavBar {
    height: 50pt;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgb(48, 48, 48);
    display: flex;
}

.Title {
    margin-left: 10pt;
    margin-right: 10pt;
    align-content: center;
    height: 100%;
    overflow: auto;
    white-space: nowrap;
}

.OpenMenuBtn {
    font-size: 30pt;
    width: 30pt;
    height: 30pt;
    margin-left: 10pt;
    margin-right: 0pt;
    margin-top: 10pt;
    margin-bottom: 10pt;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

.MenuBar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 300pt;
    background-color: rgb(48,48,48);
    z-index: 5;
}

.CloseMenuBtn {
    font-size: 30pt;
    position: fixed;
    top: 10pt;
    left: 260pt;
    width: 30pt;
    height: 30pt;
    color: white;
    z-index: 5;
}

.ScreenDarken {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 5;
}

.NavBtnContainer {
    margin-top: 50pt;
    height: calc(100% - 50pt);
    width: 100%;
}

.MenuTitle {
    margin-left: 10pt;
    margin-right: 10pt;
    align-content: center;
    text-align: center;
    height: 30pt;
    overflow: auto;
    white-space: nowrap;
    position: fixed;
    top: 10pt;
    min-width: 280pt;
    z-index: 3;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
</style>

<script setup>
import { ref } from 'vue'

const { title, disableSessions, disableProfile } = defineProps(['title', 'disableSessions', 'disableProfile']);

const isMenuOpen = ref(false);

function openMenu() {
    isMenuOpen.value = true;
}
function closeMenu() {
    isMenuOpen.value = false;
}
</script>