import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Details from '@/components/Details'
import Personal from '@/components/Personal'
import Publish from '@/components/Publish'
import Message from '@/components/Message'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path:'/',
      name:'Index',
      component:Index
    },
    {
      path:'/details',
      name:'Details',
      component:Details
    },{
      path:'/personal',
      name:'Personal',
      component:Personal
    },{
      path:'/publish',
      name:'Publish',
      component:Publish
    },{
      path:'/message',
      name:'Message',
      component:Message
    }
  ]
})
