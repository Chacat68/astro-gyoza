import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { site } from '@/config.json'
import { getSortedPosts } from '@/utils/content'

let rssCache: { content: string; timestamp: number } | null = null
const CACHE_DURATION = 1000 * 60 * 60 // 1小时缓存时间

export async function GET(context: APIContext) {
  // 检查缓存是否有效
  if (rssCache && Date.now() - rssCache.timestamp < CACHE_DURATION) {
    return new Response(rssCache.content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${Math.floor(CACHE_DURATION / 1000)}`,
      },
    })
  }

  const sortedPosts = await getSortedPosts()
  const posts = await Promise.all(
    sortedPosts.map(async (post) => {
      const { Content } = await post.render()
      const content = await Content()
      return {
        ...post,
        content: content,
      }
    })
  )

  const feed = await rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      link: `/posts/${post.slug}`,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.content,
    })),
    customData: `<language>${site.lang}</language>
    <follow_challenge>
      <feedId>106394337974619136</feedId>
      <userId>51734640829292544</userId>
    </follow_challenge>
    <!-- 在这里添加您的 XML 代码 -->
    `,
  })

  // 更新缓存
  rssCache = {
    content: feed,
    timestamp: Date.now(),
  }

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${Math.floor(CACHE_DURATION / 1000)}`,
    },
  })
}
