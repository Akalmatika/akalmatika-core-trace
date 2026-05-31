export type VisualizationStatus = 'ready' | 'development' | 'planned';

export interface VisualizationItem {
  id: string;
  categoryId: string;
  title: string;
  materialTopic: string;
  description: string;
  strengthens: string;
  misconceptionTarget: string;
  representation: string;
  modes: string[];
  href: string;
  status: VisualizationStatus;
}
