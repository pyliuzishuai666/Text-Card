
import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { 
  Sparkles, 
  Download, 
  Settings2, 
  Type as TypeIcon, 
  Layout, 
  Palette, 
  User, 
  Calendar, 
  Hash, 
  Trash2,
  Check,
  Loader2,
  Maximize,
  Square,
  RectangleVertical
} from 'lucide-react';
import { CardState, StylingOptions, ThemeType, FontType, AspectRatio } from './types';
import { CardPreview } from './components/CardPreview';
import { refineNoteWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [card, setCard] = useState<CardState>({
    title: '文字即是力量',
    content: '在这个碎片化信息的时代，我们希望让文字重新回归舞台的中央。\n\nNoteFlow 的新版本进一步压缩了日期、作者和标签等元信息的干扰，让它们以极其微小的姿态存在于角落。这样做是为了把更多的空间留给你的思想，留给每一个跳动的字符。\n\n当你在这里记录灵感时，你会发现，排版的留白和呼吸感才是最美装饰。',
    author: 'NOTEFLOW EDITOR',
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    tags: ['MINIMALISM', 'TYPOGRAPHY', 'CONTENT-FIRST']
  });

  const [styling, setStyling] = useState<StylingOptions>({
    theme: 'smartisan',
    font: 'serif',
    fontSize: 'base',
    textAlign: 'left',
    showDate: true,
    showAuthor: true,
    showTags: true,
    borderStyle: 'none',
    aspectRatio: 'auto'
  });

  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRefine = async () => {
    if (!card.content.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const refined = await refineNoteWithAI(card.content);
      setCard(prev => ({
        ...prev,
        title: refined.title,
        content: refined.content,
        tags: refined.tags
      }));
    } catch (err) {
      alert("AI 无法处理此内容，请稍后再试。");
    } finally {
      setIsRefining(false);
    }
  };

  const handleDownload = async () => {
    if (previewRef.current === null) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `noteflow-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const themes: ThemeType[] = ['smartisan', 'minimal', 'modern', 'glass', 'sepia', 'dark', 'gradient'];
  const fonts: FontType[] = ['sans', 'serif', 'mono'];
  const ratios: { label: string, value: AspectRatio, icon: React.ReactNode }[] = [
    { label: '长图', value: 'auto', icon: <Maximize size={14} /> },
    { label: '1:1', value: '1:1', icon: <Square size={14} /> },
    { label: '3:4', value: '3:4', icon: <RectangleVertical size={14} /> },
    { label: '4:5', value: '4:5', icon: <RectangleVertical size={14} className="rotate-90" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0f2f5]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[400px] bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden shrink-0 shadow-2xl z-10">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">NF</div>
            <h1 className="font-bold text-lg tracking-tight">NoteFlow</h1>
          </div>
          <button 
            onClick={() => setCard({ ...card, title: '', content: '', tags: [] })}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </header>

        <nav className="flex px-4 pt-4">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'content' ? 'border-black text-black' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
          >
            <Settings2 size={16} /> 内容
          </button>
          <button 
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'style' ? 'border-black text-black' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
          >
            <Palette size={16} /> 样式
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {activeTab === 'content' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">标题</label>
                <input 
                  type="text"
                  value={card.title}
                  onChange={(e) => setCard({...card, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all"
                  placeholder="输入标题..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">正文</label>
                  <button 
                    onClick={handleRefine}
                    disabled={isRefining}
                    className="flex items-center gap-1.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  >
                    {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    AI 润色
                  </button>
                </div>
                <textarea 
                  value={card.content}
                  onChange={(e) => setCard({...card, content: e.target.value})}
                  rows={12}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all resize-none text-slate-700 leading-relaxed"
                  placeholder="在此输入或粘贴你的文字..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">作者</label>
                  <input type="text" value={card.author} onChange={(e) => setCard({...card, author: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">日期</label>
                  <input type="text" value={card.date} onChange={(e) => setCard({...card, date: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">导出比例</label>
                <div className="grid grid-cols-4 gap-2">
                  {ratios.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setStyling({...styling, aspectRatio: r.value})}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${styling.aspectRatio === r.value ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                    >
                      {r.icon}
                      <span className="text-[10px] font-bold">{r.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">卡片主题</label>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map(t => (
                    <button
                      key={t}
                      onClick={() => setStyling({...styling, theme: t})}
                      className={`h-10 rounded-lg transition-all relative overflow-hidden ${styling.theme === t ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`w-full h-full flex items-center justify-center text-[8px] font-bold uppercase
                        ${t === 'smartisan' ? 'bg-[#fffef9] text-slate-800 border shadow-inner' : ''}
                        ${t === 'minimal' ? 'bg-white border text-slate-800' : ''}
                        ${t === 'modern' ? 'bg-slate-100 text-slate-600' : ''}
                        ${t === 'glass' ? 'bg-sky-50 text-sky-600' : ''}
                        ${t === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : ''}
                        ${t === 'dark' ? 'bg-slate-900 text-white' : ''}
                        ${t === 'gradient' ? 'bg-gradient-to-br from-indigo-400 to-pink-400 text-white' : ''}
                      `}>
                        {t === 'smartisan' ? '经典' : t}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">文字设置</label>
                <div className="flex gap-2">
                  {fonts.map(f => (
                    <button
                      key={f}
                      onClick={() => setStyling({...styling, font: f})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${styling.font === f ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                      {f === 'serif' ? '衬线' : f === 'sans' ? '无衬线' : '等宽'}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">字号</span>
                  <div className="flex gap-1">
                    {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setStyling({...styling, fontSize: size})}
                        className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${styling.fontSize === size ? 'bg-black text-white' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">可见性</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '日期', key: 'showDate' as const },
                    { label: '作者', key: 'showAuthor' as const },
                    { label: '标签', key: 'showTags' as const },
                    { label: '居中对齐', key: 'textAlign' as const }
                  ].map(toggle => (
                    <label key={toggle.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                      <span className="text-xs font-bold text-slate-500">{toggle.label}</span>
                      <input 
                        type="checkbox"
                        checked={toggle.key === 'textAlign' ? styling.textAlign === 'center' : styling[toggle.key] as boolean}
                        onChange={(e) => {
                          if (toggle.key === 'textAlign') {
                             setStyling({...styling, textAlign: e.target.checked ? 'center' : 'left'});
                          } else {
                             setStyling({...styling, [toggle.key]: e.target.checked});
                          }
                        }}
                        className="w-4 h-4 accent-black"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
          >
            <Download size={18} />
            保存为图片
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-6 md:p-12 bg-slate-200/50">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
            <CardPreview card={card} styling={styling} previewRef={previewRef} />
          </div>
          <p className="mt-8 text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] opacity-50">NoteFlow Typography Canvas</p>
        </div>
      </main>
    </div>
  );
};

export default App;
