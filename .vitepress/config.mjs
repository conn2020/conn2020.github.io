import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "云梦棠溪",
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' }
    ],

    sidebar: {
      '/koa/': [
        {
          text: 'Koa',
          items: [
            { text: 'Object.create--对象继承', link: '/koa/' },
            { text: 'Koa的代理模式', link: '/koa/delegate' },
            { text: 'Application(一)', link: '/koa/application1' },
            { text: 'Application(二)', link: '/koa/application2' },
          ]
        }
      ],
      '/other/': [
        {
          text: '其他',
          items: [
            { text: '视频防盗', link: '/other/' },
            { text: '视频转mp3--实现听歌自由', link: '/other/music' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/conn2020/conn2020.github.io' }
    ]
  }
})
