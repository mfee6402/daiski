'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CreateGroupPage() {
  const router = useRouter();
  const [step, setStep] = useState('step1');

  // **後端在 3005，前端要指定完整 URL**
  const API_BASE = 'http://localhost:3005';

  // 活動類型下拉
  const [typeOptions, setTypeOptions] = useState([]);
  const [type, setType] = useState('');

  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch(`${API_BASE}/api/group?onlyTypes=true`);
        if (!res.ok) throw new Error(`狀態 ${res.status}`);
        const keys = await res.json(); // e.g. ["SKI","MEAL"]
        const keyToLabel = { SKI: '滑雪', MEAL: '聚餐' };
        const opts = keys.map(k => ({ value: k, label: keyToLabel[k] || k }));
        setTypeOptions(opts);
        setType(opts[0]?.value || '');
      } catch (err) {
        console.warn('載入類型失敗，使用預設', err);
        const fallback = [
          { value: 'SKI', label: '滑雪' },
          { value: 'MEAL', label: '聚餐' },
        ];
        setTypeOptions(fallback);
        setType(fallback[0].value);
      }
    }
    loadTypes();
  }, []);

  // 其他表單狀態
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [minPeople, setMinPeople] = useState(1);
  const [maxPeople, setMaxPeople] = useState(6);
  const [price, setPrice] = useState(0);
  const [allowNewbie, setAllowNewbie] = useState(false);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef(null);

  const handleCoverChange = e => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };
  const handleDrop = e => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const handleCancel = () => router.push('/groups');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !location) {
      alert('請填寫標題、日期與地點');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('location', location);
    formData.append('min_people', String(minPeople));
    formData.append('max_people', String(maxPeople));
    formData.append('price', String(price));
    formData.append('allow_newbie', allowNewbie ? '1' : '0');
    formData.append('description', description);
    if (coverFile) formData.append('cover', coverFile);

    try {
      const res = await fetch(`${API_BASE}/api/group`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `狀態 ${res.status}`);
      }
      router.push('/groups');
    } catch (err) {
      console.error(err);
      alert('建立失敗：' + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <Tabs value={step} onValueChange={setStep} className="max-w-3xl mx-auto mb-8">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="step1">基本資訊</TabsTrigger>
          <TabsTrigger value="step2">確認 & 發佈</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-10">
        {step === 'step1' && (
          <Card className="p-8 space-y-6">
            <h2 className="text-lg font-semibold">基本資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 活動類型 */}
              <div>
                <Label>活動類型</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={!typeOptions.length}
                    >
                      {typeOptions.find(o => o.value === type)?.label || '載入中…'} ▾
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[160px]">
                    {typeOptions.map(opt => (
                      <Button
                        key={opt.value}
                        variant={opt.value === type ? 'secondary' : 'ghost'}
                        className="w-full text-left"
                        onClick={() => setType(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {/* 標題 */}
              <div>
                <Label htmlFor="title">揪團標題</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="例如：北海道雙板初學團"
                />
              </div>

              {/* 開始/結束日期 */}
              <div>
                <Label htmlFor="start_date">開始日期</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">結束日期</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>

              {/* 活動地點 */}
              <div className="md:col-span-2">
                <Label htmlFor="location">活動地點</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="例如：二世谷滑雪場"
                />
              </div>

              {/* 人數 */}
              <div>
                <Label htmlFor="min_people">最少人數</Label>
                <Input
                  id="min_people"
                  type="number"
                  min={1}
                  value={minPeople}
                  onChange={e => setMinPeople(+e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max_people">最多人數</Label>
                <Input
                  id="max_people"
                  type="number"
                  min={1}
                  value={maxPeople}
                  onChange={e => setMaxPeople(+e.target.value)}
                />
              </div>

              {/* 費用 */}
              <div className="md:col-span-2">
                <Label htmlFor="price">費用 (每人 TWD)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={e => setPrice(+e.target.value)}
                />
              </div>

              {/* 新手開關 */}
              <div className="md:col-span-2 flex items-center space-x-4">
                <Label>歡迎新手參加</Label>
                <Switch checked={allowNewbie} onCheckedChange={setAllowNewbie} />
              </div>

              {/* 活動描述 */}
              <div className="md:col-span-2">
                <Label htmlFor="description">活動描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="請輸入活動詳情與注意事項"
                />
              </div>

              {/* 封面圖片上傳 */}
              <div className="md:col-span-2">
                <Label>封面圖片上傳</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-sky-50/40 hover:border-sky-500 transition"
                >
                  {coverPreview ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${coverPreview})` }}
                    />
                  ) : (
                    <p className="text-slate-400">拖曳或點擊上傳封面圖片</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleCancel}>放棄</Button>
              <Button onClick={() => setStep('step2')}>下一步</Button>
            </div>
          </Card>
        )}

        {step === 'step2' && (
          <Card className="p-8 space-y-4">
            <h2 className="text-lg font-semibold">確認 & 發佈</h2>
            <div className="space-y-2">
              <p>類型：{typeOptions.find(o => o.value === type)?.label}</p>
              <p>標題：{title}</p>
              <p>日期：{startDate} ~ {endDate}</p>
              <p>地點：{location}</p>
              <p>人數：{minPeople} - {maxPeople} 人</p>
              <p>費用：NT$ {price}</p>
              <p>新手：{allowNewbie ? '允許' : '不允許'}</p>
              <p>描述：{description}</p>
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="封面預覽"
                  className="w-full h-40 object-cover rounded"
                />
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setStep('step1')}>上一步</Button>
              <Button type="submit">發布</Button>
            </div>
          </Card>
        )}
      </form>
    </main>
  );
}
