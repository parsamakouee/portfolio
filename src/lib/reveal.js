// v-reveal: fades an element in the first time it scrolls into view.
const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible')
              observer.unobserve(e.target)
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
    : null

export const reveal = {
  mounted(el) {
    el.classList.add('reveal')
    if (observer) observer.observe(el)
    else el.classList.add('is-visible')
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
