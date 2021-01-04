import morphdom from 'morphdom'

const parser = new DOMParser()
const LINK_SELECTOR = 'a[href]:not([href^="#"])' // skip links that start with hash
const FORM_SELECTOR = 'form[x-carinthia-enhance]' // forms are trickier and shouldn't be enhanced by default

const navigate = async (link) => {
  const response = await fetch(link)
  if (response.ok) {
    const responseText = await response.text()
    const responseDoc = parser.parseFromString(responseText, 'text/html')

    document.dispatchEvent(makeEvent('carinthia:unload'))
    morphdom(document.body, responseDoc.body)
    document.title = responseDoc.title
    attachLinkClickListeners()
    document.dispatchEvent(makeEvent('carinthia:load'))
    window.history.pushState({}, '', response.url)
  } else {
    // "classic" link follow
    location.replace(link)
  }
}

const handleLink = (e) => {
  e.preventDefault()
  navigate(e.currentTarget.href)
}

const formSubmit = async (formElement) => {
  const { action, method } = formElement
  // https://ultimatecourses.com/blog/transform-formdata-into-query-string
  const formData = new FormData(formElement)
  const data = [...formData.entries()]
    .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
    .join('&')

  // Possible alternative:
  // const data = new URLSearchParams(new FormData(formElement))
  const response = await fetch(action, {
    method,
    body: data,
  })

  const responseText = await response.text()
  const responseDoc = parser.parseFromString(responseText, 'text/html')

  document.dispatchEvent(makeEvent('carinthia:unload'))
  morphdom(document.body, responseDoc.body)
  document.title = responseDoc.title
  attachLinkClickListeners()
  document.dispatchEvent(makeEvent('carinthia:load'))

  if (response.redirected) {
    window.history.pushState({}, '', response.url)
  }
}

const handleForm = (e) => {
  e.preventDefault()
  formSubmit(e.currentTarget)
}

const isLocalLink = (element) => window.location.hostname === element.hostname

const attachLinkClickListeners = () => {
  const addLinkClickListeners = (elements) =>
    elements.forEach((link) => {
      if (isLocalLink(link)) {
        link.addEventListener('click', handleLink)
      }
    })

  const addFormSubmitListeners = (elements) => elements.forEach((form) => form.addEventListener('submit', handleForm))

  addLinkClickListeners(document.querySelectorAll(LINK_SELECTOR))
  addFormSubmitListeners(document.querySelectorAll(FORM_SELECTOR))

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType == addedNode.ELEMENT_NODE) {
          addLinkClickListeners(addedNode.querySelectorAll(LINK_SELECTOR))
          addFormSubmitListeners(addedNode.querySelectorAll(FORM_SELECTOR))
        }
      }
    }
  })

  observer.observe(document.body, { attributes: false, childList: true, subtree: true })
}

const makeEvent = (eventName, detail = undefined) =>
  new CustomEvent(eventName, { bubbles: true, cancelable: true, detail })

document.addEventListener('DOMContentLoaded', () => {
  attachLinkClickListeners()
  document.dispatchEvent(makeEvent('carinthia:load'))
  window.onpopstate = (event) => navigate(event.path[0]?.location?.href)
})
