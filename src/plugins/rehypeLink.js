import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

export function rehypeLink() {
  return (tree) => {
    visit(tree, { tagName: 'a' }, (node, index, parent) => {
      // 检查是否为外部链接（http开头）或邮箱链接（mailto开头）
      const isExternal = node.properties.href.startsWith('http')
      const isEmail = node.properties.href.startsWith('mailto:')

      if (isExternal) {
        node.properties = {
          ...node.properties,
          rel: 'noopener noreferrer',
          target: '_blank',
        }
        parent.children[index] = node
        const icon = h('i', { class: 'iconfont icon-external-link' })
        parent.children.splice(index + 1, 0, icon)
      }

      // 确保邮箱链接正确显示
      if (isEmail) {
        // 保留原始节点，不添加额外属性
        parent.children[index] = node
      }
    })
  }
}
