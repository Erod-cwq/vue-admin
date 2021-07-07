import Login from "@/components/Login";
import PostList from "@/components/PostList";
import layout from "@/components/layout"
export const constantRouterMap = [

    {
        path:'/',
        name:'index',
        component: layout,
        redirect:'/login',
        children:[
            {
                path:'/posts',
                name:'Post',
                component: PostList,
                meta:{title: '文章', icon:'form'}
            },
            {
                path: '/posts/write',
                name: 'PostWrite',
                component: () => import('@/components/PostEdit'),
                meta: { title: '写文章', hiddenHeaderContent: false, keepAlive: false }
            },
            {
                path: '/posts/edit',
                name: 'PostEdit',
                hidden: true,
                component: () => import('@/components/PostEdit'),
                meta: { title: '编辑文章', hiddenHeaderContent: false, keepAlive: false }
            },
            {
                path:'/attachment',
                name:'Attachment',
                component: ()=>import('@/components/AttachmentList'),
                meta: {title: '我的文件', hiddenHeaderContent: false}

            },
        ]

    },


    {
        path:'/login',
        component:Login,
        name:'Login',
        meta:{title:'登录'}
    },

]
