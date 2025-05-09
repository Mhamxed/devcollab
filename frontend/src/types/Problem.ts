interface TestCase {
    input: string;
    expectedOutput: string;
  }
  
  interface Example_Case {
    input: string;
    output: string;
    Explanation: string;
  }
  
  
  interface DefaultCode {
    javascript: string;
    python: string;
  }
  
  export interface IProblem {
    _id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    timeLimit: number;
    constraints: string[];
    exampleCases: Example_Case[]
    testCases: TestCase[];
    defaultCode: DefaultCode;
    createdBy: string;
    isFavorite: boolean;
    isCustom: boolean;
    tags: string[];
    usage: number;
    lastUsed: string;
    createdAt: Date;
    updatedAt: Date;
  }

export type CodingProblemsState = {
    all: IProblem[];
    favorites: IProblem[];
    custom: IProblem[];
  };
  