
import React from 'react';
import { CardState, StylingOptions, ThemeType, AspectRatio } from '../types';

interface CardPreviewProps {
  card: CardState;
  styling: StylingOptions;
  previewRef: React.RefObject<HTMLDivElement>;
}

const getThemeStyles = (theme: ThemeType): string => {
  switch (theme) {
    case 'minimal':
      return 'bg-white text-slate-800 border-slate-200';
    case 'modern':
      return 'bg-slate-50 text-slate-900 border-indigo-100 shadow-xl shadow-indigo-50';
    case 'glass':
      return 'bg-white/80 backdrop-blur-md border-white/50 shadow-2xl';
    case 'sepia':
      return 'bg-[#f4ecd8] text-[#5b4636] border-[#e1d5b3]';
    case 'dark':
      return 'bg-slate-900 text-slate-100 border-slate-700 shadow-2xl';
    case 'gradient':
      return 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-transparent';
    case 'smartisan':
      return 'bg-[#fffef9] text-[#444] border-[#e6e2d5] shadow-[0_10px_40px_rgba(0,0,0,0.05)]';
    default:
      return 'bg-white text-slate-800';
  }
};

const getAspectRatioClass = (ratio: AspectRatio): string => {
  switch (ratio) {
    case '1:1': return 'aspect-square';
    case '3:4': return 'aspect-[3/4]';
    case '4:5': return 'aspect-[4/5]';
    case 'auto': return 'min-h-[400px] h-auto';
    default: return '';
  }
};

const getFontSize = (size: string): string => {
  switch (size) {
    case 'sm': return 'text-base';
    case 'base': return 'text-lg';
    case 'lg': return 'text-xl';
    case 'xl': return 'text-2xl';
    default: return 'text-lg';
  }
};

export const CardPreview: React.FC<CardPreviewProps> = ({ card, styling, previewRef }) => {
  const { title, content, author, date, tags } = card;
  const { theme, font, fontSize, textAlign, showDate, showAuthor, showTags, borderStyle, aspectRatio } = styling;

  const fontClass = theme === 'smartisan' ? 'font-serif' : (font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans');
  const borderClass = borderStyle === 'thin' ? 'border' : borderStyle === 'thick' ? 'border-4' : borderStyle === 'dashed' ? 'border-2 border-dashed' : 'border-0';
  
  return (
    <div className="flex justify-center items-center w-full p-4 overflow-hidden">
      <div 
        ref={previewRef}
        className={`
          relative w-full max-w-xl transition-all duration-300 ease-in-out
          p-12 overflow-hidden flex flex-col
          ${getThemeStyles(theme)}
          ${getAspectRatioClass(aspectRatio)}
          ${borderClass}
          ${fontClass}
          ${theme === 'smartisan' ? 'rounded-sm' : 'rounded-3xl'}
        `}
      >
        {/* Subtle Paper Texture */}
        {theme === 'smartisan' && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
        )}
        
        <div className={`flex flex-col flex-1 gap-8 ${textAlign === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
          {title && (
            <h1 className={`
              font-bold leading-tight tracking-tight
              ${theme === 'smartisan' ? 'text-2xl border-b border-black/5 pb-6 w-full' : 'text-3xl'}
            `}>
              {title}
            </h1>
          )}
          
          <div className={`
            w-full leading-relaxed opacity-90 whitespace-pre-wrap flex-1
            ${getFontSize(fontSize)}
            ${theme === 'smartisan' ? 'italic text-slate-700 line-height-[1.8]' : 'line-height-[1.6]'}
          `}>
            {content}
          </div>

          {(showTags && tags.length > 0) && (
            <div className={`flex flex-wrap gap-2 pt-2 ${textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
              {tags.map((tag, i) => (
                <span 
                  key={i} 
                  className={`
                    px-2 py-0.5 text-[8px] font-bold rounded-sm uppercase tracking-widest opacity-40
                    ${theme === 'dark' ? 'bg-white/10 text-slate-300' : 'bg-black/5 text-black/60'}
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={`
            flex items-end justify-between pt-4 mt-auto w-full opacity-30 text-[9px] font-bold uppercase tracking-[0.2em]
            ${theme === 'smartisan' ? 'border-t border-black/5 pt-4' : ''}
          `}>
             <div className="flex flex-col gap-0.5">
                {showAuthor && author && <span className="hover:opacity-100 transition-opacity">{author}</span>}
                {showDate && date && <span className="hover:opacity-100 transition-opacity">{date}</span>}
             </div>
             {theme === 'smartisan' && <div className="text-[7px] opacity-20 italic lowercase tracking-normal">designed by noteflow</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
