// app/create-group/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CreateGroupPage() {
  const router = useRouter();
  const API_BASE = 'http://localhost:3005';
  const [step, setStep] = useState('step1');

  // 活動類型 (SKI / MEAL)
  const [typeOptions, setTypeOptions] = useState([]);
  const [type, setType] = useState('SKI');

  // 滑雪場清單
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationId, setLocationId] = useState('');

  // 聚餐自訂地址
  const [customLocation, setCustomLocation] = useState('');

  // 其它欄位
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPeople, setMinPeople] = useState(1);
  const [maxPeople, setMaxPeople] = useState(6);
  const [price, setPrice] = useState(0);
  const [allowNewbie, setAllowNewbie] = useState(false);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef(null);

  // 載入活動類型
  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch(`${API_BASE}/api/group?onlyTypes=true`);
        const keys = await res.json(); // e.g. ["SKI","MEAL"]
        const map = { SKI: '滑雪', MEAL: '聚餐' };
        const opts = keys.map((k) => ({ value: k, label: map[k] || k }));
        setTypeOptions(opts);
        setType(opts[0]?.value || 'SKI');
      } catch (err) {
        console.error('載入類型失敗', err);
      }
    }
    loadTypes();
  }, []);

  // 當 type = SKI 時載入滑雪場
  useEffect(() => {
    if (type !== 'SKI') return;
    async function loadLocations() {
      try {
        const res = await fetch(`${API_BASE}/api/location`);
        const list = await res.json();
        setLocationOptions(list);
        setLocationId(list[0]?.id?.toString() || '');
      } catch (err) {
        console.error('載入地點失敗', err);
      }
    }
    loadLocations();
  }, [type]);

  // 封面檔案處理
  const handleCoverChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const handleCancel = () => router.push('/groups');

  // 提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return alert('請填寫標題與日期');
    if (type === '滑雪' && !locationId) return alert('請選擇滑雪場');
    if (type === '聚餐' && !customLocation) return alert('請輸入餐廳地址');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    if (type === '滑雪') {
      formData.append('location', locationId);
    } else {
      formData.append('customLocation', customLocation);
    }
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
      if (!res.ok) throw new Error((await res.text()) || res.status);
      router.push('/groups');
    } catch (err) {
      console.error(err);
      alert('建立失敗：' + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <Tabs
        value={step}
        onValueChange={setStep}
        className="max-w-3xl mx-auto mb-8"
      >
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
                <select
                  className="w-full border p-2 rounded"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {typeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 標題 */}
              <div>
                <Label htmlFor="title">揪團標題</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：北海道雙板初學團"
                />
              </div>

              {/* 日期 */}
              <div>
                <Label htmlFor="start_date">開始日期</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">結束日期</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* 活動地點（只有 SKI 顯示下拉，MEAL 顯示文字輸入） */}
              <div className="md:col-span-2">
                <Label>活動地點</Label>
                {type === '滑雪' ? (
                  <select
                    className="w-full border p-2 rounded"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                  >
                    <option value="" disabled>
                      請選擇滑雪場
                    </option>
                    {locationOptions.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="請輸入餐廳地址"
                  />
                )}
              </div>

              {/* 人數 */}
              <div>
                <Label htmlFor="min_people">最少人數</Label>
                <Input
                  id="min_people"
                  type="number"
                  min={1}
                  value={minPeople}
                  onChange={(e) => setMinPeople(+e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max_people">最多人數</Label>
                <Input
                  id="max_people"
                  type="number"
                  min={1}
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(+e.target.value)}
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
                  onChange={(e) => setPrice(+e.target.value)}
                />
              </div>

              {/* 新手開啟 */}
              <div className="md:col-span-2 flex items-center space-x-4">
                <Label>歡迎新手參加</Label>
                <Switch
                  checked={allowNewbie}
                  onCheckedChange={setAllowNewbie}
                />
              </div>

              {/* 描述 */}
              <div className="md:col-span-2">
                <Label htmlFor="description">活動描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="請輸入活動詳情與注意事項"
                />
              </div>

              {/* 封面 */}
              <div className="md:col-span-2">
                <Label>封面圖片上傳</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-sky-50/40 hover:border-sky-500"
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
              <Button variant="outline" onClick={handleCancel}>
                放棄
              </Button>
              <Button onClick={() => setStep('step2')}>下一步</Button>
            </div>
          </Card>
        )}

        {step === 'step2' && (
          <Card className="p-8 space-y-4">
            <h2 className="text-lg font-semibold">確認 & 發佈</h2>
            <div className="space-y-2">
              <p>類型：{typeOptions.find((o) => o.value === type)?.label}</p>
              <p>標題：{title}</p>
              <p>
                日期：{startDate} ~ {endDate}
              </p>
              <p>
                地點：
                {type === '滑雪'
                  ? locationOptions.find((l) => String(l.id) === locationId)
                      ?.name
                  : customLocation}
              </p>
              <p>
                人數：{minPeople} - {maxPeople} 人
              </p>
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
              <Button variant="outline" onClick={() => setStep('step1')}>
                上一步
              </Button>
              <Button type="submit">發布</Button>
            </div>
          </Card>
        )}
      </form>
    </main>
  );
}
