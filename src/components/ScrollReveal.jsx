import { useEffect } from 'react'

const ScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const initReveal = (el) => {
      el.classList.add('reveal')
      observer.observe(el)
    }

    const handleMutations = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return
          if (node.matches?.('.section')) {
            initReveal(node)
          }
          node.querySelectorAll?.('.section').forEach(initReveal)
        })
      })
    }

    document.querySelectorAll('.section').forEach(initReveal)

    const mutationObserver = new MutationObserver(handleMutations)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}

export default ScrollReveal
