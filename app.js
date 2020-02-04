const Koa = require('koa')
const koaBody = require('koa-body')
const koaRouter = require('koa-router')
const yaml = require('js-yaml');
const fs   = require('fs');

const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

const app = new Koa();
const router = new koaRouter();

router.get('/access-token', require('./route/accessToken').getAccessToken)
router.get('/login', require('./route/login').login)
router.get('/logout', require('./route/logout').logout)
router.get('/wechat-login-callback', require('./route/wechatCallback').wechatLoginCallback)
router.get('/wechat-logout-callback', require('./route/wechatCallback').wechatLogoutCallback)
router.get('/cas-middle/:action/:session', require('./route/casCallback').middle)
router.get('/cas-login-callback/:session', require('./route/casCallback').casLoginCallback)
router.get('/cas-logout-callback/:session', require('./route/casCallback').casLogoutCallback)
router.get('/serviceValidate', require('./route/serviceValidate').serviceValidate)
if(app.env === 'development'){
    const testRoute = require('./route/test').test
    router.get('/test/:format', testRoute)
    router.get('/test', testRoute)
}

app.use(koaBody())
app.use(require('./middleware/config')())
app.use(require('./middleware/store')())
app.use(require('./middleware/errorWrapper')())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.port)
