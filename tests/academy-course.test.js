import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES,EXAM_SPECS,RESOURCES,scoreQuiz,lessonQuestions,practiceResult} from '../academy-course.js';
test('all three courses contain nine uniquely identified topics and original revision questions',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['foundation','intermediate','full']);
 for(const course of COURSES){
  assert.equal(course.lessons.length,9);
  assert.equal(new Set(course.lessons.map(l=>l.id)).size,9);
  assert.equal(lessonQuestions(course).length,9);
  for(const l of course.lessons){assert.ok(l.overview.length>60);assert.ok(l.example.length>60);assert.equal(l.question.choices.length,3);assert.ok(l.question.answer>=0&&l.question.answer<3);}
 }
});
test('revision scoring handles correct, incorrect and missing answers',()=>{
 for(const course of COURSES){
  const questions=lessonQuestions(course),answers=Object.fromEntries(questions.map(q=>[q.id,q.answer]));
  assert.equal(scoreQuiz(questions,answers).correct,9);
  assert.equal(practiceResult(course,answers).percentage,100);
  const incorrect={...answers,[questions[0].id]:(questions[0].answer+1)%3};
  assert.equal(scoreQuiz(questions,incorrect).correct,8);
  assert.equal(scoreQuiz(questions,{}).complete,false);
  assert.equal(scoreQuiz(questions,{[questions[0].id]:-1}).results[0].answered,false);
 }
});
test('official exam specs are labelled separately from nine-question revision',()=>{
 assert.deepEqual(EXAM_SPECS.foundation,{count:26,pass:19,minutes:60});
 assert.deepEqual(EXAM_SPECS.intermediate,{count:46,pass:28,minutes:90});
 assert.deepEqual(EXAM_SPECS.full,{count:58,pass:35,minutes:120});
 assert.ok(RESOURCES.some(r=>r.url.includes('rsgb.org')));
 assert.ok(RESOURCES.some(r=>r.url.includes('ukhamquiz.com')));
});
