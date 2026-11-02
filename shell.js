import {WORKSPACES,validWorkspace,workspaceFromHash} from './workspace.js';
const $=id=>document.getElementById(id);
const main=document.querySelector('main');
const nodes=[...main.children];
const pick=selector=>nodes.find(node=>node.matches(selector));
const radio=pick('section.status');
const profiles=nodes.find(node=>node.matches('section.status')&&node!==radio);
const diagnostics=pick('section.diagnostics');
const notice=pick('.notice');
const repeater=pick('.repeater-search');
const toolbar=pick('.toolbar');
const editorTable=nodes.find(node=>node.matches('.table-wrap')&&node!==repeater?.querySelector('.table-wrap'));
const editorHelp=nodes.find(node=>node.tagName==='P'&&node.previousElementSibling===toolbar);
const sdr=pick('.sdr-section');
const features=pick('.features');
const shell=document.createElement('div');shell.className='app-shell';
const sidebar=document.createElement('aside');sidebar.className='app-sidebar';sidebar.id='app-sidebar';sidebar.setAttribute('aria-label','Main navigation');
const brand=document.createElement('div');brand.className='sidebar-brand';brand.textContent='SQUAWK';sidebar.append(brand);
const nav=document.createElement('nav');nav.className='workspace-nav';nav.setAttribute('aria-label','Workspaces');sidebar.append(nav);
const content=document.createElement('div');content.className='workspace-content';
const topbar=document.createElement('div');topbar.className='workspace-topbar';
const menu=document.createElement('button');menu.type='button';menu.className='mobile-menu';menu.textContent='☰ Menu';menu.setAttribute('aria-controls','app-sidebar');menu.setAttribute('aria-expanded','false');topbar.append(menu);
const heading=document.createElement('div');heading.className='workspace-heading';
const title=document.createElement('h2');title.id='workspace-title';const subtitle=document.createElement('p');subtitle.id='workspace-description';heading.append(title,subtitle);topbar.append(heading);
const chip=document.createElement('span');chip.className='workspace-chip';chip.textContent='READ / WRITE UNAVAILABLE';topbar.append(chip);
content.append(topbar);
const pages=document.createElement('div');pages.className='workspace-pages';content.append(pages);
const views=new Map();
function view(id){const panel=document.createElement('section');panel.className='workspace-view';panel.dataset.workspace=id;panel.id='view-'+id;panel.hidden=true;pages.append(panel);views.set(id,panel);return panel;}
const dashboard=view('dashboard');
const intro=document.createElement('div');intro.className='dashboard-intro';
intro.innerHTML='<span class="eyebrow">RADIO OPERATIONS</span><h2>Your radio command centre</h2><p>Choose a workspace to configure channels, find repeaters or explore online receivers. Radio memory programming remains unavailable until verified with physical hardware.</p>';
dashboard.append(intro);
const stats=document.createElement('div');stats.className='dashboard-stats';dashboard.append(stats);
const shortcuts=document.createElement('div');shortcuts.className='dashboard-shortcuts';dashboard.append(shortcuts);
const radios=view('radios');radios.append(radio,profiles);
const channels=view('channels');channels.append(toolbar,editorHelp,editorTable);
view('repeaters').append(repeater);
view('sdr').append(sdr);
for(const id of ['frequencies','operations','tools','academy']){
 const item=WORKSPACES.find(entry=>entry.id===id),panel=view(id);
 if(id==='operations'||id==='tools'||id==='frequencies'){const mount=document.createElement('div');mount.id=id==='operations'?'range-planner':id==='tools'?'antenna-tools':'frequency-explorer';panel.append(mount);continue;}
 const placeholder=document.createElement('div');
 placeholder.className='workspace-placeholder';
 const icon=document.createElement('span');icon.className='placeholder-icon';icon.textContent='◇';
 const label=document.createElement('span');label.className='eyebrow';label.textContent='PLANNED · NOT YET AVAILABLE';
 const h=document.createElement('h2');h.textContent=item.title;
 const p=document.createElement('p');p.textContent=item.description+' will be developed here in a future phase. No feature is active in this workspace yet.';
 placeholder.append(icon,label,h,p);panel.append(placeholder);
}
const settings=view('settings');settings.append(notice,diagnostics,features);
main.replaceChildren(shell);shell.append(sidebar,content);
const backdrop=document.createElement('button');backdrop.className='nav-backdrop';backdrop.type='button';backdrop.hidden=true;backdrop.setAttribute('aria-label','Close navigation');shell.append(backdrop);
function closeMenu(){sidebar.classList.remove('is-open');backdrop.hidden=true;menu.setAttribute('aria-expanded','false');}
function refreshDashboard(){
 stats.replaceChildren();
 const values=[['Selected radio',$('model-name')?.textContent||'Not selected'],['Channels',$('count')?.textContent.replace(/[()]/g,'')||'0'],['USB connection',$('connection-state')?.textContent||'Disconnected'],['Saved profiles',String(Math.max(0,($('profiles')?.options.length||1)-1))]];
 for(const [label,value] of values){const card=document.createElement('article');card.className='stat-card';const small=document.createElement('span');small.textContent=label;const strong=document.createElement('strong');strong.textContent=value;card.append(small,strong);stats.append(card);}
}
let current='';
function navigate(id,{updateHash=true}={}){
 const selected=validWorkspace(id);
 for(const [key,panel] of views)panel.hidden=key!==selected;
 for(const button of nav.querySelectorAll('[data-target]')){const active=button.dataset.target===selected;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
 const item=WORKSPACES.find(entry=>entry.id===selected);title.textContent=item.title;subtitle.textContent=item.description;current=selected;
 if(selected==='dashboard')refreshDashboard();
 if(selected==='operations'){document.getElementById('range-map')?.dispatchEvent(new Event('squawk-map-visible'));}
 if(updateHash&&window.location.hash!=='#'+selected)window.location.hash=selected;
 closeMenu();
 window.scrollTo({top:0,behavior:'instant'});
}
let group='';
for(const item of WORKSPACES){
 if(item.group!==group){group=item.group;const label=document.createElement('div');label.className='nav-group';label.textContent=group;nav.append(label);}
 const button=document.createElement('button');button.type='button';button.dataset.target=item.id;button.className='nav-link';
 const text=document.createElement('span');text.textContent=item.title;button.append(text);
 if(!item.ready){const tag=document.createElement('small');tag.textContent='SOON';button.append(tag);}
 button.addEventListener('click',()=>navigate(item.id));nav.append(button);
 if(['channels','repeaters','sdr','frequencies','radios','operations','tools'].includes(item.id)){
  const card=document.createElement('button');card.type='button';card.className='shortcut-card';
  const name=document.createElement('strong');name.textContent=item.title;
  const description=document.createElement('span');description.textContent=item.description;
  card.append(name,description);card.onclick=()=>navigate(item.id);shortcuts.append(card);
 }
}
menu.onclick=()=>{const opened=sidebar.classList.toggle('is-open');backdrop.hidden=!opened;menu.setAttribute('aria-expanded',String(opened));};
backdrop.onclick=closeMenu;
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.addEventListener('hashchange',()=>navigate(workspaceFromHash(window.location.hash),{updateHash:false}));
document.addEventListener('change',event=>{if(['radio-model','profiles'].includes(event.target.id)&&current==='dashboard')refreshDashboard();});
const channelCount=$('count');if(channelCount){new MutationObserver(()=>{if(current==='dashboard')refreshDashboard();}).observe(channelCount,{childList:true,characterData:true,subtree:true});}
navigate(workspaceFromHash(window.location.hash),{updateHash:false});
