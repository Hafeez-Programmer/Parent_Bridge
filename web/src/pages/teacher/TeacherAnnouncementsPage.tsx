import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  PageHeader,
  SelectInput,
  TextAreaInput,
  TextInput,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { supabase, type ClassRow } from '../../lib/supabase';

interface TeacherAnnouncementView {
  id: string;
  title: string;
  body: string;
  classId: string | null;
  audience: string;
  date: string;
  schoolWide: boolean;
  isOwn: boolean;
}

export const TeacherAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [items, setItems] = useState<TeacherAnnouncementView[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audienceClassId, setAudienceClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setError(null);
    const [clsRes, annRes] = await Promise.all([
      supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id)
        .order('name')
        .order('section'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    ]);

    if (annRes.error) setError(annRes.error.message);

    const clsList = (clsRes.data ?? []) as ClassRow[];
    setClasses(clsList);
    if (clsList.length > 0 && !audienceClassId) {
      setAudienceClassId(clsList[0].id);
    }
    const clsMap = new Map(clsList.map((c) => [c.id, `Class ${c.name}-${c.section}`]));

    setItems(
      (annRes.data ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        classId: a.class_id,
        audience: a.class_id ? clsMap.get(a.class_id) ?? 'Assigned class' : 'All parents',
        date: new Date(a.created_at).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
        }),
        schoolWide: a.class_id === null,
        isOwn: a.created_by === user.id,
      })),
    );
    setLoading(false);
  }, [user, audienceClassId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !audienceClassId || !user) return;
    setError(null);
    setSaving(true);

    const payload = {
      title: title.trim(),
      body: message.trim() || title.trim(),
      class_id: audienceClassId,
    };

    const res = editingId
      ? await supabase.from('announcements').update(payload).eq('id', editingId)
      : await supabase.from('announcements').insert({ ...payload, created_by: user.id });

    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }

    setEditingId(null);
    setTitle('');
    setMessage('');
    loadData();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const { error: delErr } = await supabase.from('announcements').delete().eq('id', id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Announcements"
        subtitle="Send class notices directly to parents of your assigned classes."
      />

      {error && (
        <div className="rounded border border-light-error bg-error-container px-4 py-3 font-body text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <form
          onSubmit={handlePublish}
          className="lg:col-span-6 bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-md"
        >
          <h2 className="font-headline text-title-lg text-light-on-surface">
            {editingId ? 'Edit announcement' : 'New announcement'}
          </h2>

          <TextInput
            label="Title"
            placeholder="e.g. Class 8-A: Math quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextAreaInput
            label="Message"
            rows={5}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <SelectInput
            label="Audience (assigned classes)"
            value={audienceClassId}
            onChange={(e) => setAudienceClassId(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name}-{c.section}
              </option>
            ))}
          </SelectInput>

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="send" disabled={saving || !audienceClassId}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Publish'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setMessage('');
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        <section className="lg:col-span-6 flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-light-on-surface">Published</h2>
          <div className="flex flex-col gap-gutter-sm">
            {loading ? (
              <p className="font-body text-body-md text-light-on-surface-variant">
                Loading announcements...
              </p>
            ) : items.length === 0 ? (
              <p className="font-body text-body-md text-light-on-surface-variant">
                No announcements yet.
              </p>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="bg-light-surface border border-light-outline-variant rounded-md p-gutter-md shadow-sm flex items-center justify-between gap-gutter-md"
                >
                  <div className="flex flex-col gap-gutter-xs">
                    <h3 className="font-body text-title-md text-light-on-surface">{item.title}</h3>
                    <p className="font-body text-body-md text-light-on-surface-variant">
                      {item.audience} | {item.date}
                    </p>
                  </div>
                  {item.schoolWide || !item.isOwn ? (
                    <span className="font-body text-label-sm text-light-on-surface-variant shrink-0">
                      {item.schoolWide ? 'School-wide' : 'Read only'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-gutter-md shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setTitle(item.title);
                          setMessage(item.body);
                          if (item.classId) setAudienceClassId(item.classId);
                        }}
                        className="font-body text-label-lg text-light-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="font-body text-label-lg text-light-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
