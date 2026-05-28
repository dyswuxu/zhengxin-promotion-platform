/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 战役主题色系
        battle: {
          blue: '#3B82F6',      // 预热阶段
          orange: '#F97316',    // 强曝光阶段
          purple: '#8B5CF6',    // 套餐放大阶段
          green: '#10B981',     // 裂变复购阶段
          gold: '#EAB308',      // 战报金/冠军
        },
        // 深色主题
        dark: {
          bg: '#0F172A',        // 深海军蓝背景
          card: '#1E293B',      // 卡片背景
          border: '#334155',    // 边框
          hover: '#273548',     // 悬停
        },
        // 强调色
        accent: {
          DEFAULT: '#FF6B35',
          light: '#FF8F5C',
          dark: '#E55A26',
        },
        // 状态色
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        // 文字色
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-gold': '0 0 20px rgba(234, 179, 8, 0.5)',
        'glow-accent': '0 0 20px rgba(255, 107, 53, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}