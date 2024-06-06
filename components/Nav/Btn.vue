<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    width: 90%;
    margin-left: 5%;
    margin-top: 10pt;
    margin-bottom: 10pt;
    height: 50pt;
    border: none;
    border-radius: 20pt;
    background-color: gray;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

button:hover {
    background-color: rgb(160, 160, 160);
}

button:active {
    background-color: rgb(96, 96, 96);
}
</style>