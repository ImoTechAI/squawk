import {LESSONS,QUESTIONS,gradeAnswers} from './academy-data.js';
const root=document.getElementById('radio-academy');
if(!root)throw Error('Radio Academy mount missing');
const answers={};
root.innerHTML='<div class="tool-intro"><span class="eyebrow">LEARN · PRACTISE</span><h2>Radio Academy</h2><p>Offline lessons covering radio fundamentals, handheld controls and UK radio rules. Educational guidance only, not a substitute for current licence conditions.</p></div><div class="tool-card"><h3>Learning modules</h3><div class="academy-lessons" id="academy-lessons"></div></div><div class="tool-card"><h3>Knowledge check</h3><p class="tool-muted">Six questions. Select one answer for each question, then check your score.</p><form id="academy-quiz"><div id="academy-questions"></div><div class="actions"><button type="submit">Check answers</button><button type="reset">Try again</button></div><p id="academy-score" role="status" aria-live="polite"></p></form></div><p class="tool-muted">UK rules can change. Verify current Ofcom licence terms, service-specific regulations and radio equipment compliance before transmitting. No external API is used.</p>';
const lessons=root.querySelector('#academy-lessons');
for(const lesson of LESSONS){
 const details=document.createElement('details');details.className='academy-lesson';
 const summary=document.createElement('summary');summary.textContent=lesson.title+' — '+lesson.summary;details.append(summary);
 for(const [heading,body] of lesson.sections){const h=document.createElement('h4');h.textContent=heading;const p=document.createElement('p');p.textContent=body;details.append(h,p);}
 lessons.append(details);
}
const quiz=root.querySelector('#academy-quiz'),questions=root.querySelector('#academy-questions'),score=root.querySelector('#academy-score');
for(const [index,q] of QUESTIONS.entries()){
 const fieldset=document.createElement('fieldset');fieldset.className='academy-question';
 const legend=document.createElement('legend');legend.textContent=(index+1)+'. '+q.prompt;fieldset.append(legend);
 q.choices.forEach((choice,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name=q.id;input.value=String(i);input.addEventListener('change',()=>{answers[q.id]=i;score.textContent='';});label.append(input,document.createTextNode(' '+choice));fieldset.append(label);});
 const feedback=document.createElement('p');feedback.className='academy-feedback';feedback.dataset.question=q.id;fieldset.append(feedback);questions.append(fieldset);
}
quiz.addEventListener('submit',event=>{
 event.preventDefault();const result=gradeAnswers(answers);
 score.textContent=result.complete?'Score: '+result.correct+' / '+result.total:'Answer all '+result.total+' questions before scoring.';
 for(const row of result.results){const feedback=questions.querySelector('[data-question="'+row.id+'"]');feedback.textContent=result.complete?(row.correct?'Correct. ':'Not quite. ')+row.explanation:'';}
});
quiz.addEventListener('reset',()=>{for(const key of Object.keys(answers))delete answers[key];score.textContent='';for(const p of questions.querySelectorAll('.academy-feedback'))p.textContent='';});
