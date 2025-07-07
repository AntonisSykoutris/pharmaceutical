export type NavDataType = {
  text: string;
  path: string;
};

export type Section = {
  positionId: number;
  title: string;
};

export type SectionContextType = {
  activeSection: number;
  setActiveSection: (_: number) => void;
  activeSectionProgress: number;
  setActiveSectionProgress: (_: number) => void;
};
