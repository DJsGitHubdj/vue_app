<template>
    <div>
        <mu-appbar class="title">
            <mu-button flat color="primary">
                <mu-icon left value="menu"></mu-icon>
            </mu-button>
            Vue.js 中文社区
            <mu-menu cover slot="right" placement="bottom-end" :open.sync="menu_open">
                <mu-button icon>
                <mu-icon value="more_vert"></mu-icon>
                </mu-button>
                <mu-list slot="content">
                <mu-list-item button>
                    <mu-list-item-title>Refresh</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button>
                    <mu-list-item-title>Send feedback</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button>
                    <mu-list-item-title>Settings</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button>
                    <mu-list-item-title>Help</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button>
                    <mu-list-item-title>Sign out</mu-list-item-title>
                </mu-list-item>
                </mu-list>
            </mu-menu>
        </mu-appbar>
    </div>
    
</template>
<script>
export default {
    name:'Header',
    data(){
        return{
            menu_open:false
        }
    }
}
</script>
<style scoped>
    .title{
        /* text-align: center; */
        background: #1c6132;
        color: #fff;
    }
    .logo{
        width: 40px;
    }
</style>


