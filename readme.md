# carinthia

> follow links, morph the dom

## inspiration

- [turbo](https://turbo.hotwire.dev/)
- [htmx](https://htmx.org/)

## assumptions

- all pages load same css & js files, e.g. have same `head` element except

## limitations

- currently this only works for links, `a` tag with valid `href` attribute

## todo

- [ ] try out how this plays with Vue (or other) client side libraries
- [x] don't hijack "navigate" for non-local links; see https://github.com/bigskysoftware/htmx/blob/master/dist/htmx.js#L847-L851
