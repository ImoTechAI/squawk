import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,QUESTIONS,gradeAnswers} from '../academy-data.js';
test('academy has unique, substantive lessons and question coverage',()=>{
 assert.deepEqual(LESSONS.map(x=>x.id),['basics','controls','rules']);
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
 for(const lesson of LESSONS)assert.ok(lesson.sections.length>=3);
 for(const q of QUESTIONS){assert.ok(LESSONS.some(x=>x.id===q.lesson));assert.ok(q.choices.length>=3);assert.ok(q.answer>=0&&q.answer<q.choices.length);assert.ok(q.explanation.length>15);}
});
test('quiz grades correct, wrong and incomplete answers without mutating input',()=>{
 const all=Object.fromEntries(QUESTIONS.map(q=>[q.id,q.answer]));
 assert.deepEqual([gradeAnswers(all).correct,gradeAnswers(all).complete],[QUESTIONS.length,true]);
 const wrong={...all,[QUESTIONS[0].id]:(QUESTIONS[0].answer+1)%QUESTIONS[0].choices.length};
 assert.equal(gradeAnswers(wrong).correct,QUESTIONS.length-1);
 assert.equal(gradeAnswers({}).complete,false);
 assert.equal(gradeAnswers({[QUESTIONS[0].id]:99}).results[0].answered,false);
 assert.equal(all[QUESTIONS[0].id],QUESTIONS[0].answer);
});
