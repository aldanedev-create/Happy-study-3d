<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  import { studyStore } from '$stores/study.svelte';
  
  interface LessonContent {
    id: string;
    title: string;
    summary: string;
    mustKnow: string[];
    keyTerms: { term: string; definition: string }[];
    examples: string[];
    formulas: string[];
    commonMistakes: string[];
    advanced: string[];
    furtherResearch: string[];
  }
  
  interface Props {
    lesson: LessonContent;
    showAdvanced?: boolean;
    onComplete?: () => void;
  }
  
  let {
    lesson,
    showAdvanced = false,
    onComplete = undefined
  }: Props = $props();
  
  let showKeyTerms = $state(false);
  let showFormulas = $state(false);
  let showCommonMistakes = $state(false);
  let showAdvancedContent = $state(false);
  
  function toggleSection(section: 'keyTerms' | 'formulas' | 'commonMistakes' | 'advanced') {
    appStore.playSound('click');
    
    switch (section) {
      case 'keyTerms':
        showKeyTerms = !showKeyTerms;
        break;
      case 'formulas':
        showFormulas = !showFormulas;
        break;
      case 'commonMistakes':
        showCommonMistakes = !showCommonMistakes;
        break;
      case 'advanced':
        showAdvancedContent = !showAdvancedContent;
        break;
    }
  }
  
  function handleComplete() {
    appStore.playSound('success');
    if (onComplete) {
      onComplete();
    }
  }
</script>

<article class="lesson">
  <header class="lesson-header">
    <h2 class="lesson-title">{lesson.title}</h2>
    <button 
      class="complete-btn"
      onclick={handleComplete}
      aria-label="Mark lesson as complete"
    >
      ✓ Complete
    </button>
  </header>
  
  <div class="lesson-summary">
    <h3>Summary</h3>
    <p>{lesson.summary}</p>
  </div>
  
  {#if lesson.mustKnow && lesson.mustKnow.length > 0}
    <section class="lesson-section must-know">
      <h3>✅ Must Know</h3>
      <ul class="must-know-list">
        {#each lesson.mustKnow as concept, index}
          <li class="must-know-item">
            <span class="item-number">{index + 1}</span>
            <span>{concept}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
  
  {#if lesson.keyTerms && lesson.keyTerms.length > 0}
    <section class="lesson-section">
      <button 
        class="section-toggle"
        onclick={() => toggleSection('keyTerms')}
        aria-expanded={showKeyTerms}
      >
        <span>📖 Key Terms</span>
        <span class="toggle-icon">{showKeyTerms ? '▾' : '▸'}</span>
      </button>
      
      {#if showKeyTerms}
        <div class="section-content">
          {#each lesson.keyTerms as keyTerm}
            <div class="key-term">
              <strong>{keyTerm.term}:</strong> {keyTerm.definition}
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
  
  {#if lesson.examples && lesson.examples.length > 0}
    <section class="lesson-section">
      <h3>📝 Examples</h3>
      <div class="examples-list">
        {#each lesson.examples as example, index}
          <div class="example-item">
            <span class="example-label">Example {index + 1}</span>
            <p>{example}</p>
          </div>
        {/each}
      </div>
    </section>
  {/if}
  
  {#if lesson.formulas && lesson.formulas.length > 0}
    <section class="lesson-section">
      <button 
        class="section-toggle"
        onclick={() => toggleSection('formulas')}
        aria-expanded={showFormulas}
      >
        <span>🧮 Formulas</span>
        <span class="toggle-icon">{showFormulas ? '▾' : '▸'}</span>
      </button>
      
      {#if showFormulas}
        <div class="section-content">
          {#each lesson.formulas as formula}
            <div class="formula-item">{formula}</div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
  
  {#if lesson.commonMistakes && lesson.commonMistakes.length > 0}
    <section class="lesson-section">
      <button 
        class="section-toggle"
        onclick={() => toggleSection('commonMistakes')}
        aria-expanded={showCommonMistakes}
      >
        <span>⚠️ Common Mistakes</span>
        <span class="toggle-icon">{showCommonMistakes ? '▾' : '▸'}</span>
      </button>
      
      {#if showCommonMistakes}
        <div class="section-content">
          <ul class="mistakes-list">
            {#each lesson.commonMistakes as mistake}
              <li class="mistake-item">❌ {mistake}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </section>
  {/if}
  
  {#if showAdvanced && lesson.advanced && lesson.advanced.length > 0}
    <section class="lesson-section advanced">
      <button 
        class="section-toggle"
        onclick={() => toggleSection('advanced')}
        aria-expanded={showAdvancedContent}
      >
        <span>🚀 Advanced Topics</span>
        <span class="toggle-icon">{showAdvancedContent ? '▾' : '▸'}</span>
      </button>
      
      {#if showAdvancedContent}
        <div class="section-content">
          <ul class="advanced-list">
            {#each lesson.advanced as topic}
              <li class="advanced-item">{topic}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </section>
  {/if}
  
  {#if lesson.furtherResearch && lesson.furtherResearch.length > 0}
    <section class="lesson-section further-research">
      <h3>🔍 Further Research</h3>
      <ul class="research-list">
        {#each lesson.furtherResearch as topic}
          <li class="research-item">{topic}</li>
        {/each}
      </ul>
    </section>
  {/if}
</article>

<style>
  .lesson {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 2rem;
  }
  
  .lesson-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .lesson-title {
    color: #F1F5F9;
    font-size: 1.5rem;
    margin: 0;
  }
  
  .complete-btn {
    padding: 0.5rem 1rem;
    background: #10B981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .complete-btn:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  .lesson-summary {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #0F172A;
    border-radius: 0.5rem;
  }
  
  .lesson-summary h3 {
    margin-bottom: 0.5rem;
    color: #F1F5F9;
  }
  
  .lesson-summary p {
    color: #CBD5E1;
    line-height: 1.6;
  }
  
  .lesson-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #0F172A;
    border-radius: 0.5rem;
  }
  
  .lesson-section h3 {
    margin-bottom: 1rem;
    color: #F1F5F9;
  }
  
  .must-know-list {
    list-style: none;
    padding: 0;
  }
  
  .must-know-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #1E293B;
    border-radius: 0.5rem;
    color: #CBD5E1;
  }
  
  .item-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: #4F46E5;
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .section-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: #F1F5F9;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 0;
  }
  
  .section-toggle:hover {
    color: #4F46E5;
  }
  
  .toggle-icon {
    transition: transform 0.2s;
  }
  
  .section-content {
    margin-top: 1rem;
    animation: slideDown 0.3s ease;
  }
  
  .key-term {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #1E293B;
    border-radius: 0.25rem;
    color: #CBD5E1;
  }
  
  .key-term strong {
    color: #F1F5F9;
  }
  
  .examples-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .example-item {
    padding: 0.75rem;
    background: #1E293B;
    border-radius: 0.25rem;
  }
  
  .example-label {
    display: block;
    margin-bottom: 0.25rem;
    color: #4F46E5;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .example-item p {
    color: #CBD5E1;
    margin: 0;
  }
  
  .formula-item {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #1E293B;
    border-radius: 0.25rem;
    color: #F1F5F9;
    font-family: monospace;
    font-size: 1.1rem;
  }
  
  .mistakes-list,
  .advanced-list,
  .research-list {
    list-style: none;
    padding: 0;
  }
  
  .mistake-item,
  .advanced-item,
  .research-item {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #1E293B;
    border-radius: 0.25rem;
    color: #CBD5E1;
  }
  
  .mistake-item {
    border-left: 3px solid #DC2626;
  }
  
  .advanced-item {
    border-left: 3px solid #8B5CF6;
  }
  
  .research-item {
    border-left: 3px solid #3B82F6;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>