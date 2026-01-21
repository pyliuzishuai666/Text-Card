
export type ThemeType = 'minimal' | 'modern' | 'glass' | 'sepia' | 'dark' | 'gradient' | 'smartisan';
export type FontType = 'sans' | 'serif' | 'mono';
export type AspectRatio = '1:1' | '3:4' | '4:5' | 'auto';

export interface CardState {
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
}

export interface StylingOptions {
  theme: ThemeType;
  font: FontType;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  textAlign: 'left' | 'center';
  showDate: boolean;
  showAuthor: boolean;
  showTags: boolean;
  borderStyle: 'none' | 'thin' | 'thick' | 'dashed';
  aspectRatio: AspectRatio;
}
