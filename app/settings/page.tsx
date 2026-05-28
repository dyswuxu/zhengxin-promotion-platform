'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Database,
  Shield,
  Palette,
} from 'lucide-react';

const settingsSections = [
  {
    id: 'general',
    label: '基本设置',
    icon: Settings,
    fields: [
      { key: 'platformName', label: '平台名称', type: 'text', defaultValue: '正新新品推广作战平台' },
      { key: 'region', label: '默认区域', type: 'select', options: ['全国', '华东', '华南', '华北', '华中', '西南'] },
    ],
  },
  {
    id: 'notification',
    label: '通知设置',
    icon: Bell,
    fields: [
      { key: 'emailAlert', label: '邮件提醒', type: 'toggle', defaultValue: true },
      { key: 'taskReminder', label: '任务到期提醒', type: 'toggle', defaultValue: true },
      { key: 'dailyReport', label: '每日数据报告', type: 'toggle', defaultValue: false },
    ],
  },
  {
    id: 'display',
    label: '显示设置',
    icon: Palette,
    fields: [
      { key: 'theme', label: '主题', type: 'select', options: ['浅色', '深色', '自动'] },
      { key: 'compactMode', label: '紧凑模式', type: 'toggle', defaultValue: false },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const section = settingsSections.find(s => s.id === activeSection) || settingsSections[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">系统设置</h1>
        <p className="text-text-primary-secondary mt-1">管理平台配置和用户偏好</p>
      </div>

      <div className="flex items-start gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-dark-card rounded-xl border border-dark-border p-4">
          <nav className="space-y-1">
            {settingsSections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeSection === s.id
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-text-primary-secondary hover:bg-dark-bg hover:text-text-primary'
                  }`}
                >
                  <Icon size={18} />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-dark-card rounded-xl border border-dark-border p-6">
          <h2 className="font-semibold text-text-primary mb-6">{section.label}</h2>

          <div className="space-y-6">
            {section.fields.map(field => (
              <div key={field.key} className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
                <div>
                  <p className="font-medium text-text-primary">{field.label}</p>
                  <p className="text-xs text-text-primary-secondary mt-0.5">
                    {field.type === 'toggle' && (field.defaultValue ? '已开启' : '已关闭')}
                  </p>
                </div>
                <div className="w-64">
                  {field.type === 'text' && (
                    <input
                      type="text"
                      defaultValue={field.defaultValue as string}
                      className="w-full h-9 px-4 border border-dark-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      defaultValue={field.defaultValue as string}
                      className="w-full h-9 px-4 border border-dark-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    >
                      {(field.options as string[]).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'toggle' && (
                    <button
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        field.defaultValue ? 'bg-accent' : 'bg-dark-hover'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                        field.defaultValue ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-dark-border flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-dark transition-colors btn-press disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存设置'}
            </button>
            {saved && (
              <span className="text-sm text-success">✓ 保存成功</span>
            )}
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="text-center text-xs text-text-primary-secondary">
        <p>正新新品推广作战平台 v1.0.0 · MVP版本</p>
        <p className="mt-1">构建时间：2026-05-22</p>
      </div>
    </div>
  );
}