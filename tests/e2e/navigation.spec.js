import {expect,test} from '@playwright/test';

test('original homepage identity is retained without the discarded visual layer',async ({page,isMobile})=>{
 await page.goto('/');
 await expect(page.locator('h1')).toHaveText('Experienced IT Freelancer');
 await expect(page.locator('.header-subtitle')).toContainText('Alexandru Jungean');
 expect(await page.locator('link[href*="premium.css"]').count()).toBe(0);
 if(!isMobile)await expect(page.locator('.text-badge-wrapper')).toBeVisible();
});
async function openMenu(page,isMobile,name){
 await page.goto('/');await page.locator('#cookie-decline').click();
 if(isMobile)await page.getByRole('button',{name:'Toggle navigation menu'}).click();
 await page.getByRole('button',{name:'Explore '+name,exact:true}).click();
}
async function followMobileNavLink(page,name){
 await page.goto('/');await page.locator('#cookie-decline').click();
 await page.getByRole('button',{name:'Toggle navigation menu'}).click();
 await expect(page.locator('.nav-mega-disclosure-button:visible')).toHaveCount(0);
 await expect(page.locator('.nav-mega-panel:visible')).toHaveCount(0);
 const link=page.locator('.nav-menu-wrapper a[href="/'+name+'"]');
 await expect(link).toBeVisible();await link.click();
 await expect(page).toHaveURL(new RegExp('/'+name+'(?:\\.html)?/?$'));
}
test('projects use an automatic desktop menu and a direct mobile link',async ({page,isMobile})=>{
 if(isMobile){await followMobileNavLink(page,'projects');return;}
 await openMenu(page,isMobile,'projects');
 const panel=page.locator('#nav-mega-projects');await expect(panel).toBeVisible();
 await expect(panel.locator('.nav-mega-project-card:not([data-marquee-copy])')).toHaveCount(13);
 await expect(panel.getByRole('link')).toHaveCount(14);
 const box=await panel.boundingBox();
 if(!isMobile){expect(Math.abs(box.x)).toBeLessThan(2);expect(Math.abs(box.width-page.viewportSize().width)).toBeLessThan(2);}
 const track=panel.locator('.nav-mega-project-track');
 await expect(panel.locator('button')).toHaveCount(0);
 await expect(panel.locator('.nav-mega-project-arrow')).toHaveCount(0);
 await expect.poll(()=>track.evaluate(el=>el.scrollLeft),{timeout:9000}).toBeGreaterThan(50);
 await page.keyboard.press('Escape');await expect(panel).toBeHidden();
 await expect(page.getByRole('button',{name:'Explore projects',exact:true})).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('project strip moves continuously, slows on hover and wraps seamlessly',async ({page})=>{
 await page.setViewportSize({width:1280,height:900});await openMenu(page,false,'projects');
 const track=page.locator('.nav-mega-project-track');
 const samples=await track.evaluate(async el=>{
  const values=[];
  for(let i=0;i<8;i++){await new Promise(resolve=>setTimeout(resolve,100));values.push(el.scrollLeft);}
  return values;
 });
 const increments=samples.slice(1).map((value,i)=>value-samples[i]);
 expect(increments.filter(value=>value>0).length).toBeGreaterThanOrEqual(5);
 expect(Math.max(...increments)).toBeLessThan(20);
 await track.hover();await page.waitForTimeout(700);
 const hovered=await track.evaluate(async el=>{const before=el.scrollLeft;await new Promise(resolve=>setTimeout(resolve,600));return el.scrollLeft-before;});
 expect(hovered).toBeGreaterThan(3);expect(hovered).toBeLessThan(24);
 // Cross the seam now instead of waiting several minutes for a full cycle.
 await track.evaluate(el=>{
  const first=el.querySelector('.nav-mega-project-card');
  const copy=el.querySelector('[data-marquee-copy]');
  el.scrollLeft=copy.getBoundingClientRect().left-first.getBoundingClientRect().left-3;
 });
 await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeLessThan(100);
 await track.locator('.nav-mega-project-card:not([data-marquee-copy]) a').first().focus();
 const stopped=await track.evaluate(el=>el.scrollLeft);await page.waitForTimeout(200);
 expect(await track.evaluate(el=>el.scrollLeft)).toBe(stopped);
 await page.keyboard.press('Escape');await expect(page.locator('#nav-mega-projects')).toBeHidden();
 const closed=await track.evaluate(el=>el.scrollLeft);await page.waitForTimeout(200);
 expect(await track.evaluate(el=>el.scrollLeft)).toBe(closed);
});
test('tools include the public and by-request entries',async ({page,isMobile})=>{
 if(isMobile){await followMobileNavLink(page,'tools');return;}
 await openMenu(page,isMobile,'tools');
 const panel=page.locator('#nav-mega-tools');await expect(panel).toBeVisible();
 await expect(panel.locator('.nav-mega-tool')).toHaveCount(8);
 await expect(panel.getByRole('heading',{name:'Open tools',exact:true})).toBeVisible();
 await expect(panel.getByRole('heading',{name:'By request',exact:true})).toBeVisible();
 await expect(panel.getByRole('link',{name:/File Transfer/})).toContainText('By request');
 await expect(panel.getByRole('link',{name:/Invoicing/})).toContainText('By request');
 await panel.getByRole('link',{name:/Invoicing/}).scrollIntoViewIfNeeded();
 await expect(panel.getByRole('link',{name:/Invoicing/})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('project cards keep the cursor follower and two desktop columns',async ({page,isMobile})=>{
 await page.goto('/projects');await page.locator('#cookie-decline').click();
 const cards=page.locator('main .project-single-item');await cards.first().scrollIntoViewIfNeeded();
 const a=await cards.nth(0).boundingBox(),b=await cards.nth(1).boundingBox();
 const thumb=await cards.first().locator('.project-thumb').evaluate(el=>({w:el.clientWidth,h:el.clientHeight,nw:el.naturalWidth,nh:el.naturalHeight}));
 expect(Math.abs(thumb.w/thumb.h-thumb.nw/thumb.nh)).toBeLessThan(.02);
 await expect(cards.first().locator('.project-link')).toHaveCSS('width',isMobile?'64px':'84px');
 if(isMobile){expect(b.y).toBeGreaterThan(a.y+a.height-2);return;}
 expect(Math.abs(a.y-b.y)).toBeLessThan(2);expect(b.x).toBeGreaterThan(a.x+a.width);
 await page.mouse.move(a.x+120,a.y+110);
 const link=cards.first().locator('.project-link');await expect(link).toHaveCSS('opacity','1');
 const first=await link.evaluate(el=>parseFloat(el.style.left));
 await page.mouse.move(a.x+260,a.y+110);
 await expect.poll(()=>link.evaluate(el=>parseFloat(el.style.left))).toBeGreaterThan(first+70);
});
test('footer retains SAL, removes EU information and uses the full name',async ({page})=>{
 await page.goto('/');const links=page.locator('.consumer-dispute-links');
 await expect(links.locator('a[href="https://reclamatiisal.anpc.ro/"] img')).toHaveAttribute('width','250');
 await expect(links.locator('.consumer-redress-banner')).toHaveCount(0);
 await expect(page.locator('.copyright')).toContainText('Alexandru Jungean. All rights reserved.');
 await expect(page.locator('.footer-component a[href="/collaboration-policy"]')).toHaveCSS('text-decoration-line','underline');
});
test('reduced motion keeps the carousel stationary until manual advance',async ({page,isMobile})=>{
 if(isMobile){
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.locator('#cookie-decline').click();
  await page.getByRole('button',{name:'Toggle navigation menu'}).click();
  const link=page.locator('.nav-menu-wrapper a[href="/projects"]');await expect(link).toBeVisible();await link.focus();
  await page.keyboard.press('ArrowDown');await expect(page.locator('.nav-mega-panel:visible')).toHaveCount(0);
  await expect(link).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/projects\/?$/);return;
 }
 await page.emulateMedia({reducedMotion:'reduce'});await openMenu(page,isMobile,'projects');
 const track=page.locator('.nav-mega-project-track');const start=await track.evaluate(el=>el.scrollLeft);
 await page.waitForTimeout(6000);expect(await track.evaluate(el=>el.scrollLeft)).toBe(start);
 await track.locator('a').first().focus();
 await page.keyboard.press('ArrowRight');
 await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(start+50);
});
test('mobile breakpoint closes expanded menus and restores desktop controls',async ({page})=>{
 await page.setViewportSize({width:1280,height:900});await openMenu(page,false,'projects');
 await page.locator('#nav-mega-projects a').first().focus();
 await page.setViewportSize({width:991,height:900});
 await expect(page.locator('#nav-mega-projects')).toBeHidden();
 await expect(page.locator('.nav-mega-disclosure-button:visible')).toHaveCount(0);
 await expect(page.locator('.nav-component')).not.toHaveClass(/nav-mega-open/);
 await page.getByRole('button',{name:'Toggle navigation menu'}).click();
 for(const width of [991,768,390,320]){
  await page.setViewportSize({width,height:900});
  await expect(page.locator('.nav-menu-wrapper a[href="/projects"]')).toBeVisible();
  await expect(page.locator('.nav-menu-wrapper a[href="/tools"]')).toBeVisible();
  await expect(page.locator('.nav-mega-panel:visible')).toHaveCount(0);
  await expect(page.locator('.nav-mega-disclosure-button:visible')).toHaveCount(0);
 }
 await page.setViewportSize({width:1280,height:900});
 await expect(page.getByRole('button',{name:'Explore tools',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Explore tools',exact:true}).click();
 await expect(page.locator('#nav-mega-tools')).toBeVisible();
});
test('analytics makes no request before consent or after rejection',async ({page}) => {
  const trackers=[];
  page.on('request', request=> { if (/googletagmanager|google-analytics/.test(request.url())) trackers.push(request.url()); });
  await page.goto('/');
  await page.mouse.wheel(0,600);
  await page.waitForTimeout(4200); // Regression: the previous implementation loaded GA after 4 seconds.
  expect(trackers).toEqual([]);
  await page.locator('#cookie-decline').click();
  await page.reload();
  await expect(page.locator('#cookie-banner')).toBeHidden();
  expect(trackers).toEqual([]);
});

test('legal language switch exposes only the chosen translation',async ({page}) => {
  await page.goto('/collaboration-policy');
  await page.locator('#cookie-decline').click();
  await expect(page.locator('[data-legal-panel="en"]')).toBeVisible();
  await expect(page.locator('[data-legal-panel="ro"]')).toBeHidden();
  await page.locator('[data-legal-language="ro"]').click();
  await expect(page.locator('[data-legal-panel="ro"]')).toBeVisible();
  await expect(page.locator('[data-legal-panel="en"]')).toBeHidden();
  await page.reload();
  await expect(page.locator('[data-legal-panel="ro"]')).toBeVisible();
  await page.goto('/collaboration-policy#predare-ro');
  await expect(page.locator('[data-legal-panel="ro"]')).toBeVisible();
  await page.goto('/collaboration-policy?lang=ro#predare-en');
  await expect(page.locator('[data-legal-panel="en"]')).toBeVisible();
});

for(const route of ['/terms','/privacy-policy','/cookie-policy','/collaboration-policy']){
 test(`policy layout and reference note follow the selected language: ${route}`,async({page,isMobile})=>{
  await page.goto(route);await page.locator('#cookie-decline').click();
  await expect(page.locator('main a.footer-link-wrap')).toHaveCount(0);
  const collaborationLink=page.locator('footer a[href="/collaboration-policy"]');
  await expect(collaborationLink).toHaveCount(1);
  await expect(collaborationLink).toHaveCSS('text-decoration-line','underline');
  await expect(page.locator('footer a[aria-current="page"]')).toHaveAttribute('href',route);
  if(route==='/collaboration-policy')await expect(page.locator('[aria-labelledby="cadru-ro"] p').first()).toContainText('Termenii și condițiile. Nu modifică acordurile deja încheiate.');
  await expect(page.locator('.legal-language-note [data-legal-note="ro"]')).toBeHidden();
  await expect(page.locator('.legal-language-note [data-legal-note="en"]')).toBeVisible();
  await expect(page.locator('.legal-language-note [data-legal-note="en"]')).toContainText(/Romanian.*reference/);
  await expect(page.locator('[data-legal-language]').first()).toHaveText('English');
  await expect(page.locator('[data-legal-panel="en"]')).toBeVisible();
  await expect(page.locator('footer [data-manage-cookies]')).toHaveCount(0);
  await page.locator('[data-legal-language="ro"]').click();
  await expect(page.locator('.legal-language-note [data-legal-note="ro"]')).toBeVisible();
  await expect(page.locator('.legal-language-note [data-legal-note="en"]')).toBeHidden();
  const box=await page.locator('.legal-content').boundingBox();
  if(!isMobile)expect(box.width).toBeGreaterThanOrEqual(1000);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

test('legal documents start in English and remain readable without JavaScript',async ({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 try{
  for(const route of ['/terms','/privacy-policy','/cookie-policy','/collaboration-policy']){
   await page.goto('http://127.0.0.1:8888'+route);
   await expect(page.locator('[data-legal-panel]').first()).toHaveAttribute('lang','en');
   await expect(page.locator('[data-legal-panel="en"]')).toBeVisible();
   await expect(page.locator('[data-legal-panel="ro"]')).toBeVisible();
   await expect(page.locator('.legal-document-header')).toHaveAttribute('lang','en');
  }
 }finally{await context.close();}
});

test('contact verification is loaded only at submission; one valid request is sent',async ({page}) => {
  const protections=[]; const submissions=[];
  await page.route('https://www.google.com/recaptcha/api.js?*',route=>route.fulfill({contentType:'application/javascript',body:'window.grecaptcha={ready:cb=>cb(),execute:()=>Promise.resolve("test-token")};'}));
  await page.route('**/.netlify/functions/contact',route=>{submissions.push(route.request().postDataJSON());return route.fulfill({contentType:'application/json',body:JSON.stringify({success:true,confirmationSent:false})});});
  page.on('request',request=>{if(request.url().includes('recaptcha/api.js'))protections.push(request.url());});
  await page.goto('/contact');
  await page.locator('#cookie-decline').click();
  await page.getByLabel('Full Name',{exact:true}).fill('Test Client');
  await page.getByLabel('Email Address',{exact:true}).fill('test@example.com');
  await page.locator('[name="service"]').selectOption('Website Creation');
  await page.locator('[name="message"]').fill('I would like to discuss a website project.');
  expect(protections).toEqual([]);
  await page.locator('#submit-btn').click();
  await expect(page.locator('.success-message')).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0].recaptchaToken).toBe('test-token');
  await expect(page.locator('.success-message')).not.toContainText('confirmation');
});
