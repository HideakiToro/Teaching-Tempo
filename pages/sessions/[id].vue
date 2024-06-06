<template>
    <NavBar :title="session.name" />
    <div class="Content" v-if="showContent">
        <div class="leftContent">
            <input type="range" min="-1" max="1" step="0.01" class="slider" :value="total" disabled="true"/><br>
            <ControllsBtn :isToggled="state == -1" @toggle="toggle(-1)">fast_rewind</ControllsBtn>
            <ControllsBtn :isToggled="state == 0" @toggle="toggle(0)">play_arrow</ControllsBtn>
            <ControllsBtn :isToggled="state == 1" @toggle="toggle(1)">fast_forward</ControllsBtn>
        </div>
        <div class="rightContent">
            <div class="InfoContainer">
                <div class="Info">
                    Participants: {{ count }}
                </div>
                <div class="Info">
                    Too Fast: {{ neg }}
                </div>
                <div class="Info">
                    OK: {{ ok }}
                </div>
                <div class="Info">
                    Too Slow: {{ pos }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media only screen and (min-width: 600pt) {
    .Content {
        height: calc(100vh - 50pt);
        display: flex;
        justify-content: center;
        text-align: center;
        align-content: center;
        align-items: center;
    }

    .leftContent {
        width: calc(100vw - 300pt);
    }

    .rightContent {
        width: 300pt;
        text-align: center;
    }

    .InfoContainer {
        height: calc(100% - 50pt);
        width: calc(100% - 20pt);
        margin-right: 10pt;
        margin-left: 10pt;
        background-color: rgb(48, 48, 48);
        border-radius: 25pt;
        padding-top: 25pt;
        padding-bottom: 25pt;
    }
}

@media only screen and (max-width: 600pt) {
    .InfoContainer {
        margin-top: 50pt;
        height: calc(100% - 50pt);
        width: calc(100% - 20pt);
        margin-right: 10pt;
        margin-left: 10pt;
        background-color: rgb(48, 48, 48);
        border-radius: 25pt;
        padding-top: 25pt;
        padding-bottom: 25pt;
    }

    .Content {
        text-align: center;
        align-content: center;
    }
}

.slider {
    margin-top: 25pt;
    -webkit-appearance: none;
    appearance: none;
    width: 50%;
    min-width: 250pt;
    height: 25px;
    background: linear-gradient(to right, red, yellow, yellow, lightgreen, lightgreen, lightgreen, yellow, yellow, red);
    outline: none;
    border-radius: 7.5pt;
    height: 15pt;
    margin-bottom: 25pt;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10pt;
    height: 30pt;
    background: rgb(48, 48, 48);
    border-radius: 5pt;
}

.slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10pt;
    height: 30pt;
    background: rgb(48, 48, 48);
    border-radius: 5pt;
}

.Info {
    width: 90%;
    margin-left: 5%;
    margin-top: 10pt;
    margin-bottom: 10pt;
    height: 50pt;
    border-radius: 20pt;
    background-color: gray;
    text-align: center;
    align-content: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
</style>

<script>
import checkAuth from '~/utils/authentication';
import getCookies from '~/utils/getCookies';
export default {
    data() {
        return {
            state: 0,
            showContent: false,
            id: useRoute().params.id,
            session: {
                name: "",
                id: ""
            },
            cookies: [],
            total: 0,
            count: 0,
            neg: 0,
            pos: 0,
            ok: 0,
            reset: undefined,
            isInfoOpen: false
        }
    },
    async beforeMount() {
        let res = await checkAuth();
        if (res === true) {
            await this.loadContent();

            this.showContent = true;
        } else {
            navigateTo("/");
        }
    },
    async mounted() {
        this.cookies = getCookies();
        await this.getState();
        await this.toggle(this.state);
        setInterval(() => this.getSum(), 100);
    },
    methods: {
        async getState() {
            let res = await $fetch("/api/tempo/state?session=" + this.id + "&usersession=" + this.cookies["Session"]);
            if (res.state) {
                this.state = res.state;
            }
        },
        async toggle(btn) {
            this.state = btn;
            await $fetch("/api/tempo/state", {
                method: "POST",
                body: {
                    "userSession": this.cookies["Session"],
                    "set": this.state,
                    "session": this.id
                }
            })
            this.reset = setInterval(() => {
                this.toggle(0);
            }, 600000);
        },
        async loadContent() {
            let error = false;
            let res = await $fetch("/api/sessions/session?session=" + this.id).catch(_ => {
                navigateTo("/sessions");
                error = true;
            });
            if (!error) {
                this.session = res;
            }
        },
        async getSum() {
            $fetch("/api/tempo/sum?session=" + this.id).then(res => {
                this.total = res.total;
                this.count = res.count;
                this.neg = res.negative;
                this.ok = res.ok;
                this.pos = res.positive;
            }).catch(_ => {
                this.total = 0;
            })
        },
        openInfo() {
            this.isInfoOpen = true;
        },
        closeInfo() {
            this.isInfoOpen = false;
        }
    }
}
</script>