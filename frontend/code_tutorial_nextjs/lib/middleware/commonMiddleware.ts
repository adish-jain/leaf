import cookieSession from './cookieSession'
import cookieSessionRefresh from './cookieSessionRefresh'

export default function commonMiddleware(handler: any) {
  return cookieSession(cookieSessionRefresh(handler))
}
