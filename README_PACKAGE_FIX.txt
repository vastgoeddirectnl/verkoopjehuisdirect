PACKAGE FIX VOOR VERCEL BUILD

Deze patch zet package.json op consistente versies:
- next: 15.5.19
- react: 19.2.7
- react-dom: 19.2.7
- @neondatabase/serverless: 1.0.0
- resend: 4.5.1

Belangrijk:
1. Upload package.json en .npmrc naar de hoofdmap van GitHub.
2. Verwijder daarna handmatig package-lock.json uit GitHub.
   Uploaden van deze zip verwijdert package-lock.json niet automatisch.
3. Ga in Vercel naar Deployments.
4. Kies Redeploy.
5. Kies Redeploy without Build Cache.

De waarschuwingen die je zag ontstaan doordat package.json nog react 19.0.0 / next 15.3.3 bevat,
terwijl Vercel of dependencies react-dom 19.2.7 proberen te gebruiken.
