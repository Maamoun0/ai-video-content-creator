import React, { useEffect } from 'react';
import { Video, Sparkles, Layout, History, Settings, Play, ChevronRight, Languages } from 'lucide-react';
import { useUserStore } from './stores/userStore';
import { useProjectStore } from './stores/projectStore';

function App() {
  const { user, login, init } = useUserStore();
  const { currentProject, setCurrentProject, updateProject } = useProjectStore();
  const [view, setView] = React.useState<'landing' | 'creator'>('landing');
  const [currentStep, setCurrentStep] = React.useState(1);

  useEffect(() => {
    init();
  }, [init]);

  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleStart = () => {
    if (!currentProject) {
      setCurrentProject({
        id: crypto.randomUUID(),
        title: 'مشروع جديد',
        mode: 'shorts',
        language: 'ar',
        durationSeconds: 60,
        aspectRatio: '9:16',
        status: 'draft',
        idea: { text: '', contentType: [], uploads: [] }
      });
    }
    setView('creator');
    setCurrentStep(1);
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handlePrev = () => setCurrentStep(prev => Math.max(1, prev - 1));

  const handleGenerateScript = async () => {
    if (!currentProject?.idea.text) return;
    
    setIsGenerating(true);
    setCurrentStep(3); // Go to loading/review step
    
    try {
      const response = await fetch('http://localhost:3001/api/projects/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: currentProject.idea.text,
          language: currentProject.language,
          durationSeconds: currentProject.durationSeconds
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate script");
      
      updateProject({ script: data, status: 'scripting' });
    } catch (error: any) {
      console.error("Failed to generate script:", error);
      alert(`عذراً، فشل توليد السكريبت: ${error.message}`);
      setCurrentStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  if (view === 'creator') {
    return (
      <div className="min-h-screen bg-dark text-white font-inter" dir="rtl">
        <nav className="border-b border-border bg-card p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
            <button 
              disabled={isGenerating}
              onClick={() => setView('landing')} 
              className="text-white/50 hover:text-white transition-colors disabled:opacity-0">
              ← العودة للرئيسية
            </button>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                المرحلة {currentStep}: {currentStep === 1 ? 'الإعداد' : currentStep === 2 ? 'الفكرة' : 'السكريبت'}
              </span>
              <h2 className="font-cairo font-bold">
                {currentStep === 1 ? 'إعداد الفيديو' : currentStep === 2 ? 'ما هي فكرتك؟' : 'سكريبت الذكاء الاصطناعي'}
              </h2>
            </div>
            <div className="w-20"></div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto py-16 px-6">
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {currentStep === 1 && (
              <>
                <header className="space-y-4">
                  <h1 className="text-4xl font-black font-cairo">لنقم بضبط الأساسيات</h1>
                  <p className="text-white/40">يرجى اختيار الإعدادات المفضلة للفيديو القادم.</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 text-right">
                  <div className="space-y-4">
                    <label className="block font-cairo font-bold text-white/70">لغة المحتوى</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => updateProject({ language: 'ar' })}
                        className={`p-4 rounded-xl border transition-all ${currentProject?.language === 'ar' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-white/20'}`}>
                        العربية
                      </button>
                      <button 
                        onClick={() => updateProject({ language: 'en' })}
                        className={`p-4 rounded-xl border transition-all ${currentProject?.language === 'en' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-white/20'}`}>
                        English
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block font-cairo font-bold text-white/70">مدة الفيديو (تقريبية)</label>
                    <select 
                      className="input-field appearance-none bg-card"
                      value={currentProject?.durationSeconds}
                      onChange={(e) => updateProject({ durationSeconds: Number(e.target.value) })}>
                      <option value={60}>60 ثانية (شورتس)</option>
                      <option value={30}>30 ثانية (ريلز)</option>
                      <option value={300}>5 دقائق (يوتيوب)</option>
                      <option value={600}>10 دقائق (يوتيوب)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="btn-primary px-10 py-4 flex items-center gap-3">
                    الاستمرار للخطوة التالية <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <header className="space-y-4">
                  <h1 className="text-4xl font-black font-cairo">صف لنا مشروعك</h1>
                  <p className="text-white/40">اكتب وصفاً مختصراً عما تريد أن يتحدث عنه الفيديو.</p>
                </header>

                <div className="space-y-6">
                  <textarea 
                    className="input-field min-h-[200px] text-lg resize-none p-6"
                    placeholder="مثال: فيديو عن فوائد القهوة وتاريخها بشكل مشوق..."
                    value={currentProject?.idea.text}
                    onChange={(e) => updateProject({ idea: { ...currentProject!.idea, text: e.target.value } })}
                  />
                  
                  <div className="flex flex-wrap gap-4">
                    {['تعليمي', 'ترفيهي', 'تجاري', 'قصصي', 'وثائقي'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => {
                          const tags = currentProject?.idea.contentType || [];
                          const nextTags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
                          updateProject({ idea: { ...currentProject!.idea, contentType: nextTags } });
                        }}
                        className={`px-4 py-2 rounded-full border text-sm transition-all ${currentProject?.idea.contentType.includes(tag) ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-between items-center">
                  <button onClick={handlePrev} className="text-white/40 hover:text-white">السابق</button>
                  <button 
                    disabled={!currentProject?.idea.text}
                    onClick={handleGenerateScript}
                    className="btn-primary px-10 py-4 flex items-center gap-3 shadow-xl shadow-primary/20">
                    توليد السكريبت بالذكاء الاصطناعي <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 text-center py-12">
                {isGenerating ? (
                  <>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 animate-spin-slow">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black font-cairo">Gemini يقوم بالكتابة...</h3>
                      <p className="text-white/40 prose prose-invert mx-auto">
                        نحن نقوم الآن بتحليل فكرتك وصياغة سكريبت احترافي يتضمن المشاهد، التعليق الصوتي، والنصوص التوضيحية.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-right space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <header className="flex justify-between items-end border-b border-border pb-6">
                      <h2 className="text-3xl font-black font-cairo">{currentProject?.script?.title || 'السكريبت المقترح'}</h2>
                      <span className="text-primary font-bold">جاهز للمراجعة</span>
                    </header>
                    
                    <div className="space-y-6">
                      {currentProject?.script?.scenes.map((scene: any, i: number) => (
                        <div key={i} className="card bg-white/5 border-white/10 p-6 space-y-4">
                          <div className="flex justify-between text-xs font-bold text-white/30 uppercase tracking-widest">
                            <span>Scene {i + 1}</span>
                            <span>{scene.timestamp}</span>
                          </div>
                          <p className="text-lg leading-relaxed">{scene.narration}</p>
                          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 text-sm italic text-white/50">
                            🎥 {scene.visual_description}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-10 flex justify-end gap-4">
                        <button onClick={() => setCurrentStep(2)} className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all">تعديل الفكرة</button>
                        <button className="btn-primary px-12 py-4">الموافقة والبدء بالمونتاج ←</button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white font-inter selection:bg-primary/30" dir="rtl">
      {/* Landing page content handles buttons */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-cairo bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              صانع المحتوى الذكي
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {!user ? (
              <button onClick={login} className="btn-primary flex items-center gap-2 text-sm">
                تسجيل الدخول
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">{user.displayName}</span>
                <div className="w-10 h-10 rounded-full border border-border overflow-hidden">
                  <img src={user.photoURL || ''} alt="User" />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>مدعوم بأحدث تقنيات Gemini 2.5 Pro</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black font-cairo tracking-tight leading-tight">
            حول فكرتك إلى <span className="text-primary italic">فيديو احترافي</span> <br /> 
            في دقائق معدودة
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            الأداة الأولى لإنشاء محتوى Shorts و Reels باستخدام الذكاء الاصطناعي - من السكريبت إلى المونتاج النهائي.
          </p>
        </header>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <ModeCard 
            icon={<Video className="w-8 h-8" />}
            title="شورتس / ريلز"
            description="فيديو طولي (9:16) مثالي لـ TikTok و Instagram"
            badge="15 - 90 ثانية"
            active
            onClick={handleStart}
          />
          <ModeCard 
            icon={<Layout className="w-8 h-8" />}
            title="فيديو طويل"
            description="محتوى لـ YouTube (16:9) بجودة 1080p"
            badge="2 - 30 دقيقة"
            onClick={handleStart}
          />
          <ModeCard 
            icon={<Settings className="w-8 h-8" />}
            title="مونتاج احترافي"
            description="ارفع فيديو خاص بك واتركه للذكاء الاصطناعي"
            badge="تحسين تلقائي"
            onClick={handleStart}
          />
        </div>

        {/* Dashboard Placeholder */}
        <section className="bg-card rounded-3xl border border-border p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-primary fill-primary" />
            </div>
            <h3 className="text-3xl font-bold font-cairo">ابدأ مشروعك الأول الآن</h3>
            <p className="text-white/40 max-w-lg mx-auto">
              أكملنا الإعدادات الأساسية للنظام. نحن الآن جاهزون لبناء خط الإنتاج الآلي للسكريبت والمونتاج.
            </p>
            <button 
              onClick={handleStart}
              className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95">
               ابدأ الرحلة <ChevronRight className="inline-block mr-2 w-6 h-6" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer Status */}
      <footer className="border-t border-border py-8 mt-20 opacity-30 text-center text-sm">
        <p>© 2026 AI Content Creator Tool - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

function ModeCard({ icon, title, description, badge, active = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`card group cursor-pointer ${active ? 'border-primary ring-1 ring-primary/50' : ''}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${active ? 'bg-primary text-white' : 'bg-white/5 text-white/50 group-hover:text-primary'}`}>
        {icon}
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold font-cairo">{title}</h3>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default App;
