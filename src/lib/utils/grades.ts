export interface GradeResult {
  grade: string;
  percentage: number;
  message: string;
  color: string;
  passed: boolean;
  level: string;
}

export interface GradeScale {
  minPercentage: number;
  grade: string;
  message: string;
  color: string;
  level: string;
}

export const CXC_GRADE_SCALE: GradeScale[] = [
  {
    minPercentage: 80,
    grade: 'I',
    message: 'Outstanding! Excellent understanding of the material.',
    color: '#10B981',
    level: 'Excellent'
  },
  {
    minPercentage: 70,
    grade: 'II',
    message: 'Very good! Strong grasp of the subject matter.',
    color: '#3B82F6',
    level: 'Very Good'
  },
  {
    minPercentage: 60,
    grade: 'III',
    message: 'Good! You understand the key concepts well.',
    color: '#F59E0B',
    level: 'Good'
  },
  {
    minPercentage: 50,
    grade: 'IV',
    message: 'Fair. Review weak areas to improve.',
    color: '#F97316',
    level: 'Fair'
  },
  {
    minPercentage: 40,
    grade: 'V',
    message: 'Needs improvement. More practice required.',
    color: '#DC2626',
    level: 'Needs Improvement'
  },
  {
    minPercentage: 0,
    grade: 'VI',
    message: 'Insufficient. Please review the material thoroughly.',
    color: '#991B1B',
    level: 'Insufficient'
  }
];

export const CAPE_GRADE_SCALE: GradeScale[] = [
  {
    minPercentage: 80,
    grade: 'I',
    message: 'Outstanding! Excellent understanding of the material.',
    color: '#10B981',
    level: 'Excellent'
  },
  {
    minPercentage: 70,
    grade: 'II',
    message: 'Very good! Strong grasp of the subject matter.',
    color: '#3B82F6',
    level: 'Very Good'
  },
  {
    minPercentage: 60,
    grade: 'III',
    message: 'Good! You understand the key concepts well.',
    color: '#F59E0B',
    level: 'Good'
  },
  {
    minPercentage: 50,
    grade: 'IV',
    message: 'Fair. Review weak areas to improve.',
    color: '#F97316',
    level: 'Fair'
  },
  {
    minPercentage: 40,
    grade: 'V',
    message: 'Needs improvement. More practice required.',
    color: '#DC2626',
    level: 'Needs Improvement'
  },
  {
    minPercentage: 0,
    grade: 'VI',
    message: 'Insufficient. Please review the material thoroughly.',
    color: '#991B1B',
    level: 'Insufficient'
  }
];

export const SOFTWARE_ENGINEERING_GRADE_SCALE: GradeScale[] = [
  {
    minPercentage: 90,
    grade: 'A+',
    message: 'Outstanding! Exceptional understanding of software engineering.',
    color: '#10B981',
    level: 'Outstanding'
  },
  {
    minPercentage: 80,
    grade: 'A',
    message: 'Excellent! Strong grasp of software engineering concepts.',
    color: '#3B82F6',
    level: 'Excellent'
  },
  {
    minPercentage: 70,
    grade: 'B',
    message: 'Very good! Good understanding of the material.',
    color: '#8B5CF6',
    level: 'Very Good'
  },
  {
    minPercentage: 60,
    grade: 'C',
    message: 'Good! You understand the key concepts.',
    color: '#F59E0B',
    level: 'Good'
  },
  {
    minPercentage: 50,
    grade: 'D',
    message: 'Fair. Review weak areas to improve.',
    color: '#F97316',
    level: 'Fair'
  },
  {
    minPercentage: 40,
    grade: 'E',
    message: 'Needs improvement. More practice required.',
    color: '#DC2626',
    level: 'Needs Improvement'
  },
  {
    minPercentage: 0,
    grade: 'F',
    message: 'Insufficient. Please review the material thoroughly.',
    color: '#991B1B',
    level: 'Insufficient'
  }
];

export function calculatePercentage(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}

export function getGrade(percentage: number, examType: 'cxc' | 'cape' | 'software-engineering' = 'cxc'): GradeResult {
  const scale = examType === 'cape' 
    ? CAPE_GRADE_SCALE 
    : examType === 'software-engineering' 
      ? SOFTWARE_ENGINEERING_GRADE_SCALE 
      : CXC_GRADE_SCALE;
  
  const gradeInfo = scale.find(g => percentage >= g.minPercentage) || scale[scale.length - 1];
  
  return {
    grade: gradeInfo.grade,
    percentage,
    message: gradeInfo.message,
    color: gradeInfo.color,
    passed: percentage >= 50,
    level: gradeInfo.level
  };
}

export function isPassing(percentage: number, passingScore: number = 50): boolean {
  return percentage >= passingScore;
}

export function getPassingMessage(percentage: number, passingScore: number = 50): string {
  if (percentage >= 80) {
    return 'Excellent! You have a strong understanding.';
  } else if (percentage >= 70) {
    return 'Great job! You are well-prepared.';
  } else if (percentage >= passingScore) {
    return 'Good! You have met the passing requirement.';
  } else if (percentage >= passingScore - 10) {
    return 'Almost there! Review and try again.';
  } else {
    return 'Keep practicing! You will improve.';
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return '#10B981';
  if (percentage >= 60) return '#3B82F6';
  if (percentage >= 40) return '#F59E0B';
  return '#DC2626';
}

export function getProgressLabel(percentage: number): string {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good Progress';
  if (percentage >= 40) return 'Making Progress';
  return 'Getting Started';
}

export function getStudyRecommendation(percentage: number): string {
  if (percentage >= 80) {
    return 'You are well-prepared! Consider exploring advanced topics.';
  } else if (percentage >= 60) {
    return 'Good progress! Review weak areas and practice more.';
  } else if (percentage >= 40) {
    return 'Keep studying! Focus on must-know concepts first.';
  } else {
    return 'Start with the basics and build your understanding.';
  }
}

export function calculateGradePoint(grade: string): number {
  const gradePoints: Record<string, number> = {
    'I': 4.0,
    'II': 3.5,
    'III': 3.0,
    'IV': 2.5,
    'V': 2.0,
    'VI': 1.0,
    'A+': 4.3,
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'E': 0.5,
    'F': 0.0
  };
  
  return gradePoints[grade] || 0.0;
}

export function calculateAverageGrade(grades: string[]): string {
  if (grades.length === 0) return 'N/A';
  
  const totalPoints = grades.reduce((sum, grade) => sum + calculateGradePoint(grade), 0);
  const average = totalPoints / grades.length;
  
  if (average >= 4.0) return 'I';
  if (average >= 3.5) return 'II';
  if (average >= 3.0) return 'III';
  if (average >= 2.5) return 'IV';
  if (average >= 2.0) return 'V';
  return 'VI';
}