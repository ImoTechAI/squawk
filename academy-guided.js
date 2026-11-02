import {COURSES,EXAM_SPECS,RESOURCES,scoreQuiz,lessonQuestions} from './academy-course.js';
const root=document.getElementById('radio-academy');
if(!root)throw Error('Academy mount not found');
const storageKey='squawk-academy-progress-v1';
let saved={};
try{const value=JSON.parse(localStorage.getItem(storageKey)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{}
let level=0,step=0,stage='lesson',selected=null,checked=false,examAnswers={},examStarted=0;
const el=(tag,cls,content)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node;};
const button=(label,fn)=>{const b=el('button','',label);b.type='button';b.addEventListener('click',fn);return b;};
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}}
function completed(course,id){return Boolean(saved[course.id]?.[id]);}
function mark(course,id){saved[course.id]??={};saved[course.id][id]=true;persist();}
function links(){const p=el('p','academy-sources','Further exam preparation: ');RESOURCES.forEach((r,i)=>{if(i)p.append(document.createTextNode(' · '));const a=el('a','',r.label);a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';p.append(a);});return p;}
function render(){
 root.replaceChildren();root.classList.add('academy-course');
 const course=COURSES[level],lesson=course.lessons[step],done=course.lessons.filter(l=>completed(course,l.id)).length;
 root.append(el('h2','','Radio Academy'),el('p','academy-lead','Guided, offline lessons with practical examples, explanations and a knowledge check. Original study summaries, not official exam material.'));
 const tabs=el('div','academy-levels');COURSES.forEach((c,i)=>{const b=button(c.title,()=>{level=i;step=0;stage='lesson';selected=null;checked=false;render();});b.setAttribute('aria-pressed',String(i===level));tabs.append(b);});root.append(tabs);
 const meta=el('div','academy-course-meta');meta.append(el('p','',course.intro+' '+course.detail),el('p','','Completed '+done+' of '+course.lessons.length+' topics'));const progress=el('progress');progress.max=course.lessons.length;progress.value=done;progress.setAttribute('aria-label','Course completion');meta.append(progress);root.append(meta);
 const nav=el('div','academy-step-nav');course.lessons.forEach((l,i)=>{const b=button((completed(course,l.id)?'✓ ':'')+(i+1)+'. '+l.title,()=>{step=i;stage='lesson';selected=null;checked=false;render();});b.setAttribute('aria-current',i===step?'step':'false');nav.append(b);});root.append(nav);
 const panel=el('section','academy-stage');root.append(panel);
 if(stage==='exam'){renderExam(panel,course);root.append(links());return;}
 panel.append(el('p','academy-step-label',course.title+' · Topic '+(step+1)+' of '+course.lessons.length),el('h3','',lesson.title));
 if(stage==='lesson'){
  panel.append(el('h4','','Learn'),el('p','academy-reading',lesson.overview),el('h4','','Apply it'),el('p','academy-reading',lesson.example));
  panel.append(button('Check my understanding',()=>{stage='question';selected=null;checked=false;render();}));
 }else{
  panel.append(el('p','academy-reading',lesson.question.prompt));
  const choices=el('div','academy-choices');lesson.question.choices.forEach((choice,i)=>{const b=button(choice,()=>{if(checked)return;selected=i;render();});b.setAttribute('aria-pressed',String(selected===i));b.disabled=checked;choices.append(b);});panel.append(choices);
  if(checked){const correct=selected===lesson.question.answer;panel.append(el('p','academy-feedback', (correct?'Correct. ':'Review this topic. ')+lesson.question.explanation));panel.append(button(step===course.lessons.length-1?'Finish course':'Next topic',()=>{if(step<course.lessons.length-1){step++;stage='lesson';}else stage='finish';selected=null;checked=false;render();}));}
  else{const check=button('Check answer',()=>{checked=true;if(selected===lesson.question.answer)mark(course,lesson.id);render();});check.disabled=selected===null;panel.append(check);}
 }
 if(stage==='finish'){panel.replaceChildren(el('h3','','Course review'),el('p','academy-reading','You have reached the end of this course. Revisit any topics not yet completed, or try the nine-question revision assessment.'));panel.append(button('Start revision assessment',()=>{stage='exam';examAnswers={};examStarted=Date.now();render();}));}
 const actions=el('div','academy-bottom-actions');if(step>0)actions.append(button('Previous topic',()=>{step--;stage='lesson';selected=null;checked=false;render();}));actions.append(button('Revision assessment',()=>{stage='exam';examAnswers={};examStarted=Date.now();render();}));panel.append(actions);root.append(links());
}
function renderExam(panel,course){
 const qs=lessonQuestions(course),spec=EXAM_SPECS[course.id];
 panel.append(el('h3','','Revision assessment — '+course.title),el('p','academy-reading','Nine original revision questions, one per topic. This is not a full-length or official RSGB mock exam. Official '+course.title+' exam: '+spec.count+' questions, '+spec.minutes+' minutes, pass mark '+spec.pass+'.'));
 const form=el('form','academy-exam');qs.forEach((q,i)=>{const fs=el('fieldset','academy-exam-question'),legend=el('legend','',(i+1)+'. '+q.prompt);fs.append(legend);q.choices.forEach((c,j)=>{const label=el('label'),input=el('input');input.type='radio';input.name=q.id;input.value=String(j);input.checked=examAnswers[q.id]===j;input.addEventListener('change',()=>{examAnswers[q.id]=j;});label.append(input,document.createTextNode(' '+c));fs.append(label);});form.append(fs);});
 const result=el('div','academy-exam-result');form.append(button('Mark revision assessment',()=>{const grade=scoreQuiz(qs,examAnswers);if(!grade.complete){result.textContent='Answer every question before marking.';return;}result.replaceChildren(el('h4','','Result: '+grade.correct+' / '+grade.total));grade.results.forEach((r,i)=>result.append(el('p','',(i+1)+'. '+(r.correct?'Correct':'Incorrect')+' — '+r.explanation)));}));
 form.append(button('Return to lessons',()=>{stage='lesson';selected=null;checked=false;render();}));panel.append(form);
}
render();
