'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

/* -------- Stepper（可共用） -------- */
const STEPS = [
  { id: 'basic', name: '步驟 1', description: '填寫課程' },
  { id: 'preview', name: '步驟 2', description: '預覽與發佈' },
];
const HorizontalStepper = ({ steps, current, setCurrent }) => {
  const currIdx = steps.findIndex((s) => s.id === current);
  return (
    <nav className="mb-10">
      <ol className="flex items-start">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className={`relative flex-1 ${i < steps.length - 1 ? 'pr-8 sm:pr-12' : ''}`}
          >
            <button
              type="button"
              disabled={i > currIdx}
              onClick={() => i <= currIdx && setCurrent(s.id)}
              className="flex flex-col items-center w-full group"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full
                ${
                  i === currIdx
                    ? 'bg-primary text-primary-foreground border-2 border-primary'
                    : i < currIdx
                      ? 'bg-primary text-primary-foreground'
                      : 'border-2 border-border text-muted-foreground'
                }`}
              >
                {i < currIdx ? '✓' : i + 1}
              </span>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium
                ${i <= currIdx ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {s.name}
              </span>
              <span className="hidden sm:block text-xs text-muted-foreground/80">
                {s.description}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 h-0.5 w-full -translate-y-1/2
                  ${i < currIdx ? 'bg-primary' : 'bg-border'}`}
                style={{ width: 'calc(100% - 2.5rem)' }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/* -------- 即時預覽卡 -------- */
const LivePreview = ({ data, coverPreview }) => {
  const diffMap = { 初級: '初級', 中級: '中級', 高級: '高級' };
  return (
    <Card className="shadow-lg border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">即時預覽</CardTitle>
      </CardHeader>
      <CardContent>
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="封面預覽"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded-md mb-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed">
            <span className="text-3xl">🖼️</span>
            <p className="mt-2 text-sm">封面圖片預覽</p>
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 truncate">
          {data.name || '課程名稱'}
        </h3>
        <div className="text-sm space-y-1.5 text-muted-foreground">
          <p>
            <strong>日期：</strong>
            {data.start_at || '開始'} ~ {data.end_at || '結束'}
          </p>
          <p>
            <strong>難度：</strong>
            {diffMap[data.difficulty] || '未選擇'}
          </p>
          <p>
            <strong>價格：</strong>NT$ {data.price || '0'}
          </p>
          <p>
            <strong>人數上限：</strong>
            {data.max_people || '—'} 人
          </p>
          {data.description && (
            <p className="pt-2 border-t">
              <strong>簡介：</strong>
              <span className="whitespace-pre-wrap line-clamp-3">
                {data.description}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* -------- 主頁面 -------- */
export default function CreateCoursePage() {
  const router = useRouter();
  const { isAuth } = useAuth();

  /* ---- 狀態 ---- */
  const [step, setStep] = useState('basic');
  const [coverPreview, setCoverPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    content: '',
    start_at: '',
    end_at: '',
    difficulty: '',
    price: '',
    duration: '',
    max_people: '',
    location_id: '',
    course_img: null,
  });

  /* ---- 表單變更 ---- */
  const onChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const f = files[0];
      setForm((p) => ({ ...p, [name]: f }));
      if (f) setCoverPreview(URL.createObjectURL(f));
    } else setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---- 驗證（僅示意） ---- */
  const validate = () => {
    if (!form.name.trim()) return '請輸入課程名稱';
    if (!form.start_at || !form.end_at) return '請選擇日期';
    if (!form.difficulty) return '請選擇難度';
    return '';
  };

  /* ---- 送出 ---- */
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) return setError(errMsg);

    if (!isAuth) return setError('請先登入');

    setIsSubmitting(true);
    setError('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      // await fetch('/api/course', { method: 'POST', body: payload });
      alert('（DEMO）已送出！');
      router.push('/courses');
    } catch (e) {
      setError('建立失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- JSX ---- */
  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 dark:bg-slate-900">
      <div className="max-w-screen-2xl mx-auto">
        {/* Stepper */}
        <HorizontalStepper steps={STEPS} current={step} setCurrent={setStep} />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <div className="lg:flex lg:gap-8 xl:gap-12">
          {/* -------- 左欄 -------- */}
          <div className="lg:w-7/12 xl:w-2/3">
            {step === 'basic' && (
              <Card className="shadow-lg border">
                <CardHeader>
                  <CardTitle>新增滑雪課程</CardTitle>
                  <CardDescription>
                    請填寫下列欄位，快速建立新課程
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6">
                  {/* 課程名稱 */}
                  <div>
                    <Label htmlFor="name">課程名稱</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                    />
                  </div>
                  {/* 簡介 / 內容 */}
                  <div>
                    <Label htmlFor="description">課程簡介</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">詳細內容</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={form.content}
                      onChange={onChange}
                      rows={4}
                    />
                  </div>
                  {/* 日期 */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="start_at">開始時間</Label>
                      <Input
                        id="start_at"
                        name="start_at"
                        type="datetime-local"
                        value={form.start_at}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_at">結束時間</Label>
                      <Input
                        id="end_at"
                        name="end_at"
                        type="datetime-local"
                        value={form.end_at}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  {/* 難度 / 價格 */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="difficulty">難度</Label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={form.difficulty}
                        onChange={onChange}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                      >
                        <option value="">請選擇難度</option>
                        {['初級', '中級', '高級'].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="price">價格 (TWD)</Label>
                      <Input
                        id="price"
                        name="price"
                        value={form.price}
                        onChange={onChange}
                        placeholder="例如：3000"
                      />
                    </div>
                  </div>
                  {/* 時長 / 人數 */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="duration">時長 (小時)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={form.duration}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_people">人數上限</Label>
                      <Input
                        id="max_people"
                        name="max_people"
                        type="number"
                        value={form.max_people}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  {/* 地點 / 圖片 */}
                  <div>
                    <Label htmlFor="location_id">地點</Label>
                    <select
                      id="location_id"
                      name="location_id"
                      value={form.location_id}
                      onChange={onChange}
                      className="mt-1 w-full rounded-md border px-3 py-2"
                    >
                      <option value="">請選擇地點</option>
                      {/* TODO: 後端取得 location list */}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="course_img">課程圖片</Label>
                    <Input
                      id="course_img"
                      name="course_img"
                      type="file"
                      accept="image/*"
                      onChange={onChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/courses')}
                  >
                    取消
                  </Button>
                  <Button className="ml-4" onClick={() => setStep('preview')}>
                    下一步
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 'preview' && (
              <Card className="shadow-lg border">
                <CardHeader>
                  <CardTitle>確認課程資訊</CardTitle>
                  <CardDescription>
                    請檢查以下內容，確認無誤後發佈
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>名稱：</strong>
                    {form.name}
                  </p>
                  <p>
                    <strong>日期：</strong>
                    {form.start_at} ~ {form.end_at}
                  </p>
                  <p>
                    <strong>難度：</strong>
                    {form.difficulty}
                  </p>
                  <p>
                    <strong>價格：</strong>NT$ {form.price}
                  </p>
                  <p>
                    <strong>人數上限：</strong>
                    {form.max_people}
                  </p>
                  <p>
                    <strong>簡介：</strong>
                    {form.description}
                  </p>
                  {/* 其他欄位自行補充 */}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" onClick={() => setStep('basic')}>
                    上一步
                  </Button>
                  <Button
                    className="ml-4"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? '發佈中...' : '確認發佈'}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* -------- 右欄 -------- */}
          <aside className="hidden lg:block lg:w-5/12 xl:w-1/3 mt-10 lg:mt-0">
            <div className="space-y-6 sticky top-10">
              <LivePreview data={form} coverPreview={coverPreview} />
              {step === 'preview' && (
                <Card className="shadow-lg border bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center text-red-600">
                      <span className="text-xl mr-2">⚠️</span> 注意事項
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1 text-red-700">
                    <p>• 請確認課程資訊真實、準確。</p>
                    <p>• 發佈後可在「我的課程」頁面管理。</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
