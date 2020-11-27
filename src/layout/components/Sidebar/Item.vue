<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    svg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, svg, title } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={icon} />)
    } else if (svg) {
      vnodes.push(<svg-icon icon-class={svg}/>)
    }
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
