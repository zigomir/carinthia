import morphdom from 'morphdom'

const parser = new DOMParser()
const LINK_SELECTOR = 'a[href]'

const navigate = async (link) => {
  const response = await fetch(link)
  if (response.ok) {
    const responseText = await response.text()
    const responseDoc = parser.parseFromString(responseText, 'text/html')

    morphdom(document.body, responseDoc.body)
    document.title = responseDoc.title
    attachLinkClickListeners()
    document.dispatchEvent(makeEvent('carinthia:load'))
    window.history.pushState({}, '', link)
  } else {
    // "classic" link follow
    location.replace(link)
  }
}

const handleLink = (e) => {
  e.preventDefault()
  navigate(e.currentTarget.href)
}

const isLocalLink = (element) => window.location.hostname === element.hostname

const attachLinkClickListeners = () => {
  const addLinkClickListeners = (elements) =>
    elements.forEach((link) => {
      if (isLocalLink(link)) {
        link.addEventListener('click', handleLink)
      }
    })

  addLinkClickListeners(document.querySelectorAll(LINK_SELECTOR))
  const targetNodes = document.querySelectorAll('[x-carinthia-enhance]')
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        addLinkClickListeners(addedNode.parentNode.querySelectorAll(LINK_SELECTOR))
      }
    }
  })

  for (const targetNode of targetNodes) {
    observer.observe(targetNode, { attributes: false, childList: true, subtree: false })
  }
}

const makeEvent = (eventName, detail = undefined) =>
  new CustomEvent(eventName, { bubbles: true, cancelable: true, detail })

document.addEventListener('DOMContentLoaded', () => {
  attachLinkClickListeners()
  window.onpopstate = (event) => navigate(event.path[0]?.location?.href)
  document.dispatchEvent(makeEvent('carinthia:load'))
})
