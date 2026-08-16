export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  // Simple seeded random number generator
  const random = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function getRandomItem<T>(array: T[]): T | null {
  if (array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}

export function getRandomQuestions<T>(questions: T[], count: number): T[] {
  return getRandomItems(questions, count);
}

export function createQuestionOrder(questionIds: string[], shuffleEnabled: boolean = true): string[] {
  return shuffleEnabled ? shuffle(questionIds) : [...questionIds];
}

export function randomizeOptions(options: string[]): { options: string[]; correctIndex: number } {
  const originalIndex = 0; // Assume first option is correct
  const shuffled = shuffle(options);
  const correctIndex = shuffled.indexOf(options[originalIndex]);
  
  return {
    options: shuffled,
    correctIndex
  };
}

export function generateRandomId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}-${random}`;
}

export function sampleFromArray<T>(array: T[], sampleSize: number): T[] {
  if (sampleSize >= array.length) return shuffle(array);
  return getRandomItems(array, sampleSize);
}