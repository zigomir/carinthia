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
    addLinkClickListeners(document.querySelectorAll(LINK_SELECTOR))
    document.dispatchEvent(makeEvent('carinthia:load'))
  } else {
    // "classic" link follow
    location.replace(link)
  }
}

const handleLink = (e) => {
  e.preventDefault()
  const link = e.currentTarget.href
  navigate(link)
  window.history.pushState({}, '', link)
}

const isLocalLink = (element) => window.location.hostname === element.hostname

const addLinkClickListeners = (elements) =>
  elements.forEach((link) => {
    if (isLocalLink(link)) {
      link.addEventListener('click', handleLink)
    }
  })

const makeEvent = (eventName, detail = undefined) =>
  new CustomEvent(eventName, { bubbles: true, cancelable: true, detail })

document.addEventListener('DOMContentLoaded', () => {
  addLinkClickListeners(document.querySelectorAll(LINK_SELECTOR))
  window.onpopstate = (event) => navigate(event.path[0]?.location?.href)

  const targetNodes = document.querySelectorAll('[x-carinthia-enhance]')
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.querySelectorAll) {
          addLinkClickListeners(addedNode.querySelectorAll(LINK_SELECTOR))
        }
      }
    }
  })

  for (const targetNode of targetNodes) {
    observer.observe(targetNode, { attributes: false, childList: true, subtree: false })
  }

  document.dispatchEvent(makeEvent('carinthia:load'))
})
