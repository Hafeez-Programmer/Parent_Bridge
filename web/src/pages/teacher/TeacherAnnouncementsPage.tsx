import React, { useState } from 'react';
import {
  Button,
  PageHeader,
  SelectInput,
  TextAreaInput,
  TextInput,
} from '../../components/ui';
import { INITIAL_TEACHER_ANNOUNCEMENTS, type AnnouncementItem } from '../../data/mockData';

export const TeacherAnnouncementsPage: React.FC = () => {
  const [items, setItems] = useState<AnnouncementItem[]>(INITIAL_TEACHER_ANNOUNCEMENTS);
  const [title, setTitle] = useState('Class 8-A: Math quiz');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('Class 8-A');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setItems((prev) => [
      {
        id: `ta${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        audience,
        date: 'Today',
      },
      ...prev,
    ]);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="flex flex-col gap-gutter-lg">
      <PageHeader
        title="Announcements"
        subtitle="Send class notices directly to parents of your assigned classes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <form
          onSubmit={handlePublish}
          className="lg:col-span-6 bg-light-surface border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-md"
        >
          <h2 className="font-headline text-title-lg text-light-on-surface">New announcement</h2>

          <TextInput
            label="Title"
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
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option>Class 8-A</option>
            <option>Class 9-A</option>
            <option>Class 9-B</option>
          </SelectInput>

          <div className="flex items-center gap-gutter-md pt-gutter-sm">
            <Button type="submit" variant="primary" icon="send">
              Publish
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
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
            {items.map((item) => (
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
                {item.schoolWide ? (
                  <span className="font-body text-label-sm text-light-on-surface-variant shrink-0">
                    School-wide
                  </span>
                ) : (
                  <div className="flex items-center gap-gutter-md shrink-0">
                    <button
                      type="button"
                      onClick={() => setTitle(item.title)}
                      className="font-body text-label-lg text-light-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((a) => a.id !== item.id))}
                      className="font-body text-label-lg text-light-error hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
