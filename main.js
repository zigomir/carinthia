import morphdom from 'morphdom'
const parser = new DOMParser()

const navigate = async (link) => {
  const response = await fetch(link)
  if (response.ok) {
    const responseText = await response.text()
    const responseDoc = parser.parseFromString(responseText, 'text/html')

    morphdom(document.body, responseDoc.body)
    document.title = responseDoc.title
    addLinkClickListeners()
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

const addLinkClickListeners = () =>
  document.querySelectorAll('a').forEach((link) => {
    if (isLocalLink(link)) {
      link.addEventListener('click', handleLink)
    }
  })

const makeEvent = (eventName, detail = undefined) =>
  new CustomEvent(eventName, { bubbles: true, cancelable: true, detail })

document.addEventListener('DOMContentLoaded', () => {
  addLinkClickListeners()
  document.dispatchEvent(makeEvent('carinthia:load'))
  window.onpopstate = (event) => navigate(event.path[0]?.location?.href)
})
