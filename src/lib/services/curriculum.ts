import { browser } from '$app/environment';

// Static imports for all JSON files
import mathematics from '../data/cxc/mathematics.json';
import englishA from '../data/cxc/english-a.json';
import englishB from '../data/cxc/english-b.json';
import pob from '../data/cxc/pob.json';
import poa from '../data/cxc/poa.json';
import socialStudies from '../data/cxc/social-studies.json';
import integratedScience from '../data/cxc/integrated-science.json';
import hsb from '../data/cxc/hsb.json';
import informationTechnology from '../data/cxc/information-technology.json';
import agriculturalScience from '../data/cxc/agricultural-science.json';
import cxcBiology from '../data/cxc/biology.json';
import cxcChemistry from '../data/cxc/chemistry.json';
import cxcPhysics from '../data/cxc/physics.json';
import spanish from '../data/cxc/spanish.json';
import officeAdministration from '../data/cxc/office-administration.json';

import communicationStudies from '../data/cape/communication-studies.json';
import caribbeanStudies from '../data/cape/caribbean-studies.json';
import pureMathematics from '../data/cape/pure-mathematics.json';
import capeBiology from '../data/cape/biology.json';
import capeChemistry from '../data/cape/chemistry.json';
import capePhysics from '../data/cape/physics.json';
import managementOfBusiness from '../data/cape/management-of-business.json';
import accounting from '../data/cape/accounting.json';
import economics from '../data/cape/economics.json';
import sociology from '../data/cape/sociology.json';
import law from '../data/cape/law.json';
import computerScience from '../data/cape/computer-science.json';

import softwareEngineering from '../data/software-engineering/software-engineering.json';

class CurriculumService {
  private cache = new Map<string, any>();
  private subjectList: any[] = [];

  constructor() {
    if (browser) {
      this.loadSubjectList();
    }
  }

  loadSubjectList(): any[] {
    if (this.subjectList.length > 0) {
      return this.subjectList;
    }

    const subjects = [
      // CXC Subjects
      { data: mathematics, area: 'cxc' },
      { data: englishA, area: 'cxc' },
      { data: englishB, area: 'cxc' },
      { data: pob, area: 'cxc' },
      { data: poa, area: 'cxc' },
      { data: socialStudies, area: 'cxc' },
      { data: integratedScience, area: 'cxc' },
      { data: hsb, area: 'cxc' },
      { data: informationTechnology, area: 'cxc' },
      { data: agriculturalScience, area: 'cxc' },
      { data: cxcBiology, area: 'cxc' },
      { data: cxcChemistry, area: 'cxc' },
      { data: cxcPhysics, area: 'cxc' },
      { data: spanish, area: 'cxc' },
      { data: officeAdministration, area: 'cxc' },

      // CAPE Subjects
      { data: communicationStudies, area: 'cape' },
      { data: caribbeanStudies, area: 'cape' },
      { data: pureMathematics, area: 'cape' },
      { data: capeBiology, area: 'cape' },
      { data: capeChemistry, area: 'cape' },
      { data: capePhysics, area: 'cape' },
      { data: managementOfBusiness, area: 'cape' },
      { data: accounting, area: 'cape' },
      { data: economics, area: 'cape' },
      { data: sociology, area: 'cape' },
      { data: law, area: 'cape' },
      { data: computerScience, area: 'cape' },

      // Software Engineering
      { data: softwareEngineering, area: 'software-engineering' }
    ];

    subjects.forEach(({ data, area }) => {
      // The software-engineering source groups its subject under `curriculum`.
      // Normalising here lets all routes use one curriculum contract.
      const source = (data as any)?.curriculum?.['software-engineering'] ?? data;
      if (source) {
        this.subjectList.push({ ...source, area });
      }
    });

    console.log('✅ Total subjects loaded:', this.subjectList.length);
    return this.subjectList;
  }

  loadSubject(subjectId: string, area: string): any | null {
    if (this.subjectList.length === 0) {
      this.loadSubjectList();
    }

    const cacheKey = `${area}-${subjectId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Find in subject list
    const subject = this.subjectList.find(
      s => s.area === area && (s.id === subjectId || s.id === `${area}-${subjectId}`)
    );

    if (subject) {
      const resolved = { ...subject, area };
      this.cache.set(cacheKey, resolved);
      console.log(`✅ Subject loaded: ${subject.name}`);
      return resolved;
    }

    console.error(`❌ Subject not found: ${area}/${subjectId}`);
    console.error('Available subjects:', this.subjectList.map(s => `${s.area}/${s.id}`));
    return null;
  }

  loadTopic(subjectId: string, topicId: string, area: string): any | null {
    const subject = this.loadSubject(subjectId, area);
    if (!subject) return null;

    // Search across levels, units, or root topics
    if (subject.levels) {
      for (const level of subject.levels) {
        const topic = level.topics?.find((t: any) => t.id === topicId);
        if (topic) return topic;
      }
    }

    if (subject.units) {
      for (const unit of subject.units) {
        const topic = unit.topics?.find((t: any) => t.id === topicId);
        if (topic) return topic;
      }
    }

    if (subject.topics) {
      return subject.topics.find((t: any) => t.id === topicId) || null;
    }

    return null;
  }

  getSubjectById(subjectId: string): any | null {
    if (this.subjectList.length === 0) {
      this.loadSubjectList();
    }
    return this.subjectList.find(s => s.id === subjectId) || null;
  }

  getSubjectsByArea(area: string): any[] {
    if (this.subjectList.length === 0) {
      this.loadSubjectList();
    }
    return this.subjectList.filter(s => s.area === area);
  }

  getAllSubjects(): any[] {
    if (this.subjectList.length === 0) {
      this.loadSubjectList();
    }
    return this.subjectList;
  }

  getUnits(subject: any): any[] {
    return subject?.units || [];
  }

  getTopics(subject: any, unitId?: string): any[] {
    if (!subject) return [];

    if (unitId && subject.units) {
      const unit = subject.units.find((u: any) => u.id === unitId);
      return unit?.topics || [];
    }

    if (subject.topics) {
      return subject.topics;
    }

    if (subject.levels) {
      return subject.levels.flatMap((l: any) => l.topics || []);
    }

    if (subject.units) {
      return subject.units.flatMap((u: any) => u.topics || []);
    }

    return [];
  }

  getLessons(topic: any): any[] {
    if (!topic) return [];

    if (topic.lessons && Array.isArray(topic.lessons)) {
      return topic.lessons;
    }

    if (topic.summary || topic.mustKnow || topic.keyTerms) {
      return [{
        id: topic.id,
        title: topic.title,
        summary: topic.summary || topic.description || '',
        mustKnow: topic.mustKnow || [],
        keyTerms: topic.keyTerms || [],
        examples: topic.examples || [],
        formulas: topic.formulas || [],
        codeExamples: topic.codeExamples || [],
        commonMistakes: topic.commonMistakes || [],
        practiceQuestions: topic.questions || [],
        furtherResearch: topic.furtherResearch || [],
        externalResources: topic.resources || [],
        importance: topic.importance,
        difficulty: topic.difficulty
      }];
    }

    return [];
  }

  getAllTopics(subject: any): any[] {
    return this.getTopics(subject);
  }

  getAllLessons(subject: any): any[] {
    const topics = this.getTopics(subject);
    return topics.flatMap((topic: any) => this.getLessons(topic));
  }

  getAllQuestions(subject: any): any[] {
    const topics = this.getTopics(subject);
    const questions: any[] = [];

    topics.forEach((topic: any) => {
      if (topic.questions) {
        questions.push(...topic.questions);
      }

      const lessons = this.getLessons(topic);
      lessons.forEach((lesson: any) => {
        if (lesson.practiceQuestions) {
          questions.push(...lesson.practiceQuestions);
        }
      });
    });

    return questions;
  }

  clearCache(): void {
    this.cache.clear();
    this.subjectList = [];
  }
}

export const curriculumService = new CurriculumService();
