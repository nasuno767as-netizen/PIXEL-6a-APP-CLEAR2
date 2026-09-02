export interface ProjectFile {
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'properties';
  content: string;
  description: string;
}

export type TabType = 'install' | 'simulator' | 'code' | 'macrodroid' | 'architecture';

export interface RunningApp {
  id: string;
  name: string;
  iconName: string;
  previewColor: string;
  type: string;
  memoryMb: number;
}
