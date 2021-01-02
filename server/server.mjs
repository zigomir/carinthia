import Koa from 'koa'
import coBody from 'co-body'

const app = new Koa()

app.use(async (ctx) => {
  const body = await coBody.form(ctx.req)
  console.log(`Email: ${body.email}, password: ${body.password}`)
  ctx.redirect('/after-post-index')
})

app.listen(3000)
