
export interface LessonData {
  school: string;
  lessonsPerWeek: number;
  environment: string;
  equipment: (string | number)[];
  construct: string;
  constructItems: (string | number)[];
  preparationItems: (string | number)[];
  mainItems: (string | number)[];
  finishItems: (string | number)[];
  preparationTime: number;
  mainTime: number;
  finishTime: number;
  preparationRole: string;
  mainRole: string;
  finishRole: string;
  grade: number;
}

export const mockLessonData: LessonData = {
  school: 'Základní škola Ostrava',
  lessonsPerWeek: 2,
  environment: 'Tělocvična',
  equipment: [1, 3, 5],
  construct: 'Základní gymnastický konstrukt',
  constructItems: [1, 2, 3, 4],
  preparationItems: [1],
  mainItems: [2, 3],
  finishItems: [4],
  preparationTime: 10,
  mainTime: 25,
  finishTime: 10,
  preparationRole: 'Učitel',
  mainRole: 'Učitel',
  finishRole: 'Učitel',
  grade: 5
};
