import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Upload, Shield, AlertCircle, X, ArrowLeft } from 'lucide-react';
import Layout, { useToastContext } from '@/components/layout/Layout';
import { createSubmission, uploadEvidence } from '@/lib/dataService';

const CATEGORIES = [
  'Women Safety',
  'Crime',
  'Politics',
  'Ground Reports',
  'Fake News Debunked',
  'Survivor Stories',
];

export default function SubmitStory() {
  const { addToast } = useToastContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', story_title: '', story_content: '', category: '',
    instagram_link: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        addToast('Maximum 5 files allowed', 'error');
        return;
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.story_title.trim()) newErrors.story_title = 'Story title is required';
    if (!formData.story_content.trim()) newErrors.story_content = 'Story content is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!isAnonymous && !formData.name.trim() && !formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Please provide at least one contact detail or submit anonymously';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Upload evidence files
      const evidenceUrls: string[] = [];
      for (const file of files) {
        try {
          const url = await uploadEvidence(file);
          if (url) evidenceUrls.push(url);
        } catch { /* skip failed uploads */ }
      }

      await createSubmission({
        name: isAnonymous ? undefined : formData.name || undefined,
        email: isAnonymous ? undefined : formData.email || undefined,
        phone: isAnonymous ? undefined : formData.phone || undefined,
        story_title: formData.story_title,
        story_content: formData.story_content,
        category: formData.category,
        evidence_urls: evidenceUrls.length > 0 ? evidenceUrls : undefined,
        is_anonymous: isAnonymous,
        admin_notes: formData.instagram_link ? `Instagram Link: ${formData.instagram_link}` : undefined,
      });

      addToast('Story submitted successfully! Our team will review it.', 'success');
      setFormData({ name: '', email: '', phone: '', story_title: '', story_content: '', category: '' });
      setFiles([]);
      setIsAnonymous(false);
    } catch (err: any) {
      addToast(err.message || 'Failed to submit story. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-hti-gray hover:text-hti-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="text-center mb-10">
            <PenTool className="w-12 h-12 text-hti-primary mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Submit Your Story</h1>
            <p className="text-hti-gray max-w-lg mx-auto">
              Aapki awaaz, hamari zimmedari. Share your story with us - we verify, we publish, we amplify.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="card-glass rounded-xl p-4 mb-8 flex items-start gap-3">
            <Shield className="w-5 h-5 text-hti-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium">Your identity is protected</p>
              <p className="text-xs text-hti-gray mt-1">
                You can submit anonymously. Even if you provide contact details, we never share them publicly without your consent.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="card-glass rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-12 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-hti-green' : 'bg-hti-border'}`}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${isAnonymous ? 'left-6.5' : 'left-0.5'}`}
                    style={{ left: isAnonymous ? '26px' : '2px' }}
                  />
                </div>
                <span className="text-sm font-medium">Report Anonymously</span>
              </label>
            </div>

            {/* Contact Fields (hidden when anonymous) */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Name (optional)</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Email (optional)</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Phone (optional)</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-lg bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {errors.contact && (
              <div className="flex items-center gap-2 text-hti-breaking text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.contact}
              </div>
            )}

            {/* Story Title */}
            <div>
              <label className="block text-sm text-white mb-2">Story Title *</label>
              <input
                type="text" name="story_title" value={formData.story_title} onChange={handleChange}
                placeholder="Give your story a compelling title..."
                className={`w-full px-4 py-3 rounded-lg bg-hti-card border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors ${errors.story_title ? 'border-hti-breaking' : 'border-hti-border'}`}
              />
              {errors.story_title && (
                <p className="text-hti-breaking text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.story_title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-white mb-2">Category *</label>
              <select
                name="category" value={formData.category} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-hti-card border text-white focus:outline-none focus:border-hti-primary transition-colors ${errors.category ? 'border-hti-breaking' : 'border-hti-border'}`}
              >
                <option value="" className="bg-hti-card">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-hti-card">{c}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-hti-breaking text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.category}</p>
              )}
            </div>

            {/* Story Content */}
            <div>
              <label className="block text-sm text-white mb-2">Your Story *</label>
              <textarea
                name="story_content" value={formData.story_content} onChange={handleChange}
                placeholder="Describe what happened in detail..."
                rows={8}
                className={`w-full px-4 py-3 rounded-lg bg-hti-card border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors resize-none ${errors.story_content ? 'border-hti-breaking' : 'border-hti-border'}`}
              />
              {errors.story_content && (
                <p className="text-hti-breaking text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.story_content}</p>
              )}
            </div>

            {/* Instagram Link */}
            <div>
              <label className="block text-sm text-white mb-2">Instagram Reel/Post Link (Optional)</label>
              <input
                type="url" name="instagram_link" value={formData.instagram_link} onChange={handleChange}
                placeholder="https://www.instagram.com/reels/..."
                className="w-full px-4 py-3 rounded-lg bg-hti-card border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm text-white mb-2">Upload Photos/Videos (Optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-hti-border rounded-xl p-6 text-center cursor-pointer hover:border-hti-primary/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-hti-gray mx-auto mb-2" />
                <p className="text-sm text-hti-gray">Click to upload photos or videos</p>
                <p className="text-xs text-hti-gray/60 mt-1">Max 5 files, 10MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-hti-card rounded-lg px-3 py-2">
                      <span className="text-sm text-white truncate max-w-[250px]">{file.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-hti-gray hover:text-hti-breaking">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-base font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : <><PenTool className="w-5 h-5" /> Submit Story</>}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
