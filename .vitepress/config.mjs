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
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/conn2020/conn2020.github.io' }
    ]
  }
})
