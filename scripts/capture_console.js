import { chromium } from 'playwright';

(async () => {
  const url = process.env.TARGET_URL || 'https://moodify-music-tau.vercel.app';
  console.log('Using TARGET_URL =', url);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];

  page.on('console', msg => {
    logs.push({type: 'console', level: msg.type(), text: msg.text()});
  });

  page.on('pageerror', err => {
    logs.push({type: 'pageerror', message: err.message, stack: err.stack});
  });

  page.on('requestfailed', req => {
    const failure = req.failure ? req.failure().errorText : null;
    logs.push({type: 'requestfailed', url: req.url(), method: req.method(), failure});
  });

  page.on('response', resp => {
    try{
      const status = resp.status();
      if (status >= 400) logs.push({type: 'response', url: resp.url(), status, statusText: resp.statusText()});
    }catch(e){}
  });

  try{
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  }catch(e){
    logs.push({type: 'navigationError', message: e.message});
  }

  // allow any deferred scripts to run
  await page.waitForTimeout(3000);

  console.log('---PLAYWRIGHT LOG START---');
  console.log(JSON.stringify(logs, null, 2));
  console.log('---PAGE CONTENT SNIPPET---');
  try{
    const html = await page.content();
    console.log(html.slice(0, 4000));
  }catch(e){
    console.log('failed to get page content:', e.message);
  }

  try{
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    console.log('---#root.innerHTML---');
    console.log(rootHtml.slice(0, 2000));
  }catch(e){
    console.log('failed to read #root:', e.message);
  }

  await browser.close();
})();
