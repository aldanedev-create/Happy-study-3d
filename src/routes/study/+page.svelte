<script lang="ts">
  import { onMount } from 'svelte';
  import { studyStore, type StudyMode } from '$stores/study.svelte';
  let mode = $state<StudyMode>('learn');
  let selectedAnswer = $state('');
  let finished = $state(false);
  const modes: { id: StudyMode; label: string; icon: string }[] = [
    { id: 'learn', label: 'Learn', icon: '📖' }, { id: 'practice', label: 'Practice', icon: '✍️' },
    { id: 'quiz', label: 'Quiz', icon: '🎯' }, { id: 'exam', label: 'Exam prep', icon: '📝' }
  ];
  onMount(() => { const p = new URLSearchParams(window.location.search); const s = p.get('subject'); const a = p.get('area'); if (s && (a === 'cxc' || a === 'cape' || a === 'software-engineering')) studyStore.loadSubject(s, a); });
  function changeMode(next: StudyMode) { mode = next; selectedAnswer = ''; finished = false; studyStore.setStudyMode(next); }
  function answer() { if (!selectedAnswer) return; studyStore.answerQuestion(selectedAnswer); if (!studyStore.nextQuestion()) { studyStore.saveProgress(); finished = true; } selectedAnswer = ''; }
  function restart() { studyStore.resetQuiz(); finished = false; selectedAnswer = ''; }
</script>

<svelte:head><title>{studyStore.currentSubject?.name || 'Study'} · Happy Study 3D</title></svelte:head>

{#if !studyStore.currentSubject && !studyStore.isLoading}
  <section class="empty"><p class="eyebrow">YOUR STUDY SPACE</p><h1>Choose a subject to begin</h1><p>Explore CXC, CAPE, or Software Engineering pathways.</p><a href="/">Explore pathways</a></section>
{:else if studyStore.isLoading}
  <section class="empty"><h1>Building your study plan…</h1></section>
{:else}
  <div class="study-shell">
    <aside class="topics"><p class="eyebrow">{studyStore.currentSubject?.level} PATHWAY</p><h1>{studyStore.currentSubject?.icon} {studyStore.currentSubject?.name}</h1><p>{studyStore.currentSubject?.description}</p><div class="topic-list">{#each studyStore.topicList as topic, index}<button class:active={studyStore.currentTopic?.id === topic.id} onclick={() => studyStore.loadTopic(topic.id)}><span>{String(index + 1).padStart(2, '0')}</span>{topic.title}</button>{/each}</div></aside>
    <main class="lesson">
      <div class="mode-tabs">{#each modes as item}<button class:active={mode === item.id} onclick={() => changeMode(item.id)}>{item.icon} {item.label}</button>{/each}</div>
      {#if mode === 'learn'}
        <p class="eyebrow">NOW LEARNING</p><h2>{studyStore.currentLesson?.title || studyStore.currentTopic?.title}</h2><p class="summary">{studyStore.currentLesson?.summary || studyStore.currentTopic?.description}</p>
        {#if studyStore.currentLesson?.mustKnow?.length}<section class="panel"><h3>Must know for exam day</h3><ul>{#each studyStore.currentLesson.mustKnow as item}<li>{item}</li>{/each}</ul></section>{/if}
        {#if studyStore.currentLesson?.keyTerms?.length}<section class="panel"><h3>Key terms</h3><div class="terms">{#each studyStore.currentLesson.keyTerms as item}<div><strong>{item.term}</strong><span>{item.definition}</span></div>{/each}</div></section>{/if}
        {#if studyStore.currentLesson?.codeExamples?.length}<section class="panel"><h3>Try the code</h3>{#each studyStore.currentLesson.codeExamples as example}<pre><code>{example.code}</code></pre><p>{example.explanation}</p>{/each}</section>{/if}
        <section class="pathway"><div><span>PASS PATH</span><strong>Learn the must-knows, key terms, and complete every available practice set.</strong></div><div><span>100% PATH</span><strong>Explain each idea in your own words, redo missed questions, then make a timed mini-exam.</strong></div></section>
        <section class="notes"><div><h3>Make your own revision notes</h3><p>Use <a href="https://obsidian.md/download" target="_blank" rel="noopener noreferrer">Obsidian</a>, <a href="https://www.microsoft.com/microsoft-365/onenote/digital-note-taking-app" target="_blank" rel="noopener noreferrer">OneNote</a>, or <a href="https://keep.google.com/" target="_blank" rel="noopener noreferrer">Google Keep</a>. Create one page per topic: key terms, a worked example, and your common mistakes.</p></div><a href="/audio">Record an audio note →</a></section>
      {:else if finished}
        <section class="result"><span>🏆</span><p class="eyebrow">SESSION COMPLETE</p><h2>{Math.round((studyStore.score / Math.max(studyStore.currentQuestions.length, 1)) * 100)}%</h2><p>You answered {studyStore.score} of {studyStore.currentQuestions.length} correctly.</p><button onclick={restart}>Try this set again</button></section>
      {:else if studyStore.currentQuestion}
        <section class="question"><p class="eyebrow">QUESTION {studyStore.currentQuestionIndex + 1} OF {studyStore.currentQuestions.length}</p><h2>{studyStore.currentQuestion.question}</h2><div class="answers">{#each studyStore.currentQuestion.options || [] as option}<button class:selected={selectedAnswer === option} onclick={() => selectedAnswer = option}>{option}</button>{/each}</div><button class="primary" disabled={!selectedAnswer} onclick={answer}>{studyStore.currentQuestionIndex === studyStore.currentQuestions.length - 1 ? 'Finish session' : 'Check & continue'}</button></section>
      {:else}<section class="empty"><h2>Practice questions are coming soon.</h2><p>Choose another topic or use Learn mode to build your foundation.</p></section>{/if}
    </main>
  </div>
{/if}

<style>
  .study-shell{display:grid;grid-template-columns:minmax(250px,330px) 1fr;gap:1.25rem}.topics,.lesson,.empty{background:rgba(15,23,42,.68);border:1px solid rgba(148,163,184,.18);border-radius:24px;padding:clamp(1.25rem,3vw,2.4rem);box-shadow:0 20px 60px rgba(2,6,23,.28)}.topics h1{font-size:1.75rem;line-height:1.15;margin:.4rem 0 .75rem}.topics>p:not(.eyebrow){color:#94a3b8}.eyebrow{font-size:.72rem;letter-spacing:.13em;font-weight:800;color:#a78bfa;margin:0 0 .65rem}.topic-list{display:grid;gap:.35rem;margin-top:1.5rem;max-height:55vh;overflow:auto;padding-right:.25rem}.topic-list button,.mode-tabs button{border:0;background:transparent;color:#cbd5e1;text-align:left;padding:.75rem;border-radius:12px;cursor:pointer}.topic-list button span{color:#64748b;font-size:.7rem;margin-right:.55rem}.topic-list button:hover,.topic-list button.active,.mode-tabs button.active{background:rgba(124,58,237,.2);color:#fff}.mode-tabs{display:flex;gap:.25rem;padding:.3rem;background:#111827;border-radius:14px;width:max-content;max-width:100%;overflow:auto}.mode-tabs button{white-space:nowrap}.lesson h2{font-size:clamp(1.75rem,4vw,2.75rem);line-height:1.08;margin:0 0 1rem}.summary{color:#cbd5e1;line-height:1.75;font-size:1.05rem;max-width:65ch}.panel,.pathway,.notes{margin-top:1.2rem;padding:1.2rem;border-radius:16px;background:linear-gradient(145deg,rgba(30,41,59,.75),rgba(15,23,42,.8));border:1px solid rgba(148,163,184,.12)}.panel h3{margin-top:0}.panel ul{padding-left:1.2rem;color:#dbeafe}.panel li+li{margin-top:.65rem}.terms{display:grid;gap:.7rem}.terms div{display:grid;gap:.15rem}.terms strong{color:#c4b5fd}.terms span{color:#cbd5e1}pre{overflow:auto;background:#020617;padding:1rem;border-radius:12px;color:#a7f3d0}.pathway{display:grid;grid-template-columns:1fr 1fr;gap:1rem;background:linear-gradient(130deg,rgba(79,70,229,.25),rgba(8,145,178,.16))}.pathway div{display:grid;gap:.35rem}.pathway span{font-size:.7rem;font-weight:800;letter-spacing:.11em;color:#c4b5fd}.notes{display:flex;gap:1rem;justify-content:space-between;align-items:center}.notes h3{margin:0}.notes p{margin:.4rem 0 0;color:#cbd5e1;line-height:1.6}.notes a{color:#c4b5fd;white-space:nowrap;font-weight:700}.question{max-width:760px;margin:2rem auto}.answers{display:grid;gap:.65rem;margin:1.5rem 0}.answers button{padding:1rem;border-radius:14px;text-align:left;border:1px solid #334155;background:#172033;color:#e2e8f0;cursor:pointer}.answers button:hover,.answers button.selected{border-color:#8b5cf6;background:rgba(124,58,237,.2)}.primary,.result button,.empty a{display:inline-flex;border:0;border-radius:12px;padding:.85rem 1.2rem;background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;font-weight:800;text-decoration:none;cursor:pointer}.primary:disabled{opacity:.4;cursor:not-allowed}.result{text-align:center;padding:3rem 1rem}.result span{font-size:3rem}.result h2{font-size:4.5rem;margin:.25rem}.empty{text-align:center;max-width:720px;margin:4rem auto}.empty h1{font-size:2rem}.empty p{color:#94a3b8;margin-bottom:1.5rem}@media(max-width:800px){.study-shell{grid-template-columns:1fr}.topic-list{max-height:240px}.lesson{padding:1.25rem}.mode-tabs{width:100%}.pathway{grid-template-columns:1fr}.notes{align-items:flex-start;flex-direction:column}}
</style>
