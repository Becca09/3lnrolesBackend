import app from '../src/app.js';

export default function handler(req: any, res: any) {
  if (typeof req.url === 'string') {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  return app(req, res);
}
