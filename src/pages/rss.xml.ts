import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { site } from '@/config.json'
import { getSortedPosts } from '@/utils/content'

// 导出异步 GET 函数，接收 Astro API 上下文作为参数
export async function GET(context: APIContext) {
  // 获取经过排序的文章列表
  const sortedPosts = await getSortedPosts()
  
  // 删除这里多余的大括号，直接返回 rss 配置
  return rss({
    title: site.title,
    // 设置 RSS feed 的描述
    description: site.description,
    // 设置站点 URL
    site: context.site!,
    // 将文章转换为 RSS 条目
    items: sortedPosts.map((post) => ({
      // 文章链接
      link: `/posts/${post.slug}`,
      // 文章标题
      title: post.data.title,
      // 发布日期
      pubDate: post.data.date,
      // 文章摘要
      description: post.data.summary,
    })),
    // 自定义 XML 数据
    customData: `<language>${site.lang}</language>
    <follow_challenge>
      <feedId>106394337974619136</feedId>
      <userId>51734640829292544</userId>
    </follow_challenge>
    <!-- 在这里添加您的 XML 代码 -->
    `,
  })
