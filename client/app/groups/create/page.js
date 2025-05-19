// app/create-group/page.js
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// 步驟定義
const STEPS_CONFIG = [
  { id: 'step1', name: '步驟 1', description: '基本資訊' },
  { id: 'step2', name: '步驟 2', description: '預覽與發佈' },
];

// 水平步驟指示器元件
const HorizontalStepper = ({ steps, currentStepId, setCurrentStep }) => {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStepId);
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol role="list" className="flex items-start">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative flex-1 ${stepIdx < steps.length - 1 ? 'pr-8 sm:pr-12' : ''}`}
          >
            <button
              type="button"
              onClick={() =>
                stepIdx <= currentStepIndex && setCurrentStep(step.id)
              }
              className={`flex flex-col items-center text-center group w-full ${stepIdx <= currentStepIndex ? 'cursor-pointer' : 'cursor-default'}`}
              disabled={stepIdx > currentStepIndex}
            >
              {/* 調整 active/completed/default 狀態的顏色 */}
              <span
                className={`relative flex h-10 w-10 items-center justify-center rounded-full ${stepIdx === currentStepIndex ? 'bg-primary border-2 border-primary text-primary-foreground' : stepIdx < currentStepIndex ? 'bg-primary text-primary-foreground' : 'border-2 border-border bg-card dark:border-border-dark dark:bg-card-dark text-muted-foreground dark:text-muted-foreground-dark'}`}
              >
                {stepIdx < currentStepIndex ? '✓' : stepIdx + 1}
              </span>
              <span
                className={`mt-2 block text-xs sm:text-sm font-medium ${stepIdx <= currentStepIndex ? 'text-primary' : 'text-muted-foreground dark:text-muted-foreground-dark'}`}
              >
                {step.name}
              </span>
              <span
                className={`text-xs ${stepIdx <= currentStepIndex ? 'text-primary/80' : 'text-muted-foreground/80 dark:text-muted-foreground-dark/80'} hidden sm:block`}
              >
                {step.description}
              </span>
            </button>
            {stepIdx < steps.length - 1 ? (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${stepIdx < currentStepIndex ? 'bg-primary' : 'bg-border dark:bg-border-dark'}`}
                style={{
                  transform:
                    'translateX(calc(50% + var(--stepper-icon-radius, 1.25rem) / 2 + var(--stepper-gap, 0.5rem)))',
                  width:
                    'calc(100% - var(--stepper-icon-radius, 1.25rem) - 2 * var(--stepper-gap, 0.5rem))',
                }}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <style jsx>{`
        li {
          --stepper-icon-radius: 2.5rem;
          --stepper-gap: 0.5rem;
        }
        @media (min-width: 640px) {
          li {
            --stepper-gap: 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

// 即時預覽卡片元件
const LivePreviewCard = ({
  formData,
  typeOptions,
  locationOptions,
  skiDifficultyOptions,
  coverPreview,
}) => {
  const {
    title,
    type,
    startDate,
    endDate,
    locationId,
    customLocation,
    difficulty,
    minPeople,
    maxPeople,
    price,
    allowNewbie,
    description,
  } = formData;
  const selectedTypeLabel = type || '未選擇';
  let locationDisplay = '未指定';
  if (type === '滑雪' && locationId) {
    locationDisplay =
      locationOptions.find((l) => String(l.id) === String(locationId))?.name ||
      '讀取中...';
  } else if (customLocation) {
    locationDisplay = customLocation;
  }
  const difficultyDisplay = difficulty || '';

  return (
    // 卡片使用 bg-card，確保與頁面背景有區別
    <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">即時預覽</CardTitle>
      </CardHeader>
      <CardContent>
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="封面預覽"
            className="w-full h-48 object-cover rounded-md mb-4 bg-muted dark:bg-muted-dark border border-border dark:border-border-dark"
          />
        ) : (
          <div className="w-full h-48 bg-muted dark:bg-muted-dark rounded-md mb-4 flex flex-col items-center justify-center text-muted-foreground dark:text-muted-foreground-dark border border-dashed border-border dark:border-border-dark">
            <span className="text-3xl">🖼️</span>
            <p className="mt-2 text-sm">封面圖片預覽</p>
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 truncate">
          {title || '您的揪團標題'}
        </h3>
        <div className="space-y-1.5 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              類型：
            </span>
            {selectedTypeLabel}
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              日期：
            </span>
            {startDate || '開始日期'} ~ {endDate || '結束日期'}
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              地點：
            </span>
            {locationDisplay}
          </p>
          {type === '滑雪' && difficultyDisplay && (
            <p>
              <span className="font-medium text-foreground dark:text-foreground-dark">
                難度：
              </span>
              {difficultyDisplay}
            </p>
          )}
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              人數：
            </span>
            {minPeople || 'N'} - {maxPeople || 'N'} 人
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              費用：
            </span>
            NT$ {price || '0'} / 每人
          </p>
          <p>
            <span className="font-medium text-foreground dark:text-foreground-dark">
              歡迎新手：
            </span>
            {allowNewbie ? '是' : '否'}
          </p>
          {description && (
            <div className="mt-2 pt-2 border-t border-border dark:border-border-dark">
              <p className="font-medium text-foreground dark:text-foreground-dark">
                描述：
              </p>
              <p className="whitespace-pre-wrap truncate h-16">{description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CreateGroupPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';
  const [currentStep, setCurrentStep] = useState('step1');

  // 表單 state (與之前相同)
  const [typeOptions, setTypeOptions] = useState([]);
  const [type, setType] = useState('');
  const [openTypePopover, setOpenTypePopover] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPeople, setMinPeople] = useState(2);
  const [maxPeople, setMaxPeople] = useState(10);
  const [price, setPrice] = useState(0);
  const [allowNewbie, setAllowNewbie] = useState(true);
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef(null);
  const skiDifficultyOptions = [
    { value: '初級', label: '初級' },
    { value: '中級', label: '中級' },
    { value: '進階', label: '進階' },
  ];
  const [difficulty, setDifficulty] = useState('');
  const [openDifficultyPopover, setOpenDifficultyPopover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // useEffect 邏輯 (與之前相同)
  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch(`${API_BASE}/api/group?onlyTypes=true`);
        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: '無法獲取活動類型 (回應非JSON)' }));
          throw new Error(errData.error || `請求失敗: ${res.status}`);
        }
        const labels = await res.json();
        const opts = labels.map((label) => ({ value: label, label: label }));
        setTypeOptions(opts);
        if (opts.length > 0 && !type) {
          setType(opts[0].value);
        }
      } catch (err) {
        console.error('載入類型失敗:', err);
        setFormError(`無法載入活動類型：${err.message}`);
      }
    }
    loadTypes();
  }, [API_BASE, type]);

  useEffect(() => {
    if (type !== '滑雪') {
      setLocationOptions([]);
      setLocationId('');
      return;
    }
    async function loadLocations() {
      try {
        const res = await fetch(`${API_BASE}/api/location`);
        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: '無法獲取滑雪場列表 (回應非JSON)' }));
          throw new Error(errData.error || `請求失敗: ${res.status}`);
        }
        const list = await res.json();
        setLocationOptions(list || []);
      } catch (err) {
        console.error('載入滑雪場地點失敗:', err);
        setFormError(`無法載入滑雪場列表：${err.message}`);
      }
    }
    loadLocations();
  }, [type, API_BASE]);

  const handleCoverChange = (e) => {
    /* ... */ const f = e.target.files?.[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        alert('圖片檔案過大，請上傳小於 5MB 的圖片。');
        return;
      }
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };
  const handleDrop = (e) => {
    /* ... */ e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      if (f.size > 5 * 1024 * 1024) {
        alert('圖片檔案過大，請上傳小於 5MB 的圖片。');
        return;
      }
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    } else {
      alert('請拖曳圖片檔案。');
    }
  };
  const clearCoverImage = () => {
    /* ... */ setCoverFile(null);
    setCoverPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleCancel = () => router.push('/groups');
  const validateStep1 = useCallback(() => {
    /* ... */ setFormError('');
    if (!type) {
      setFormError('請選擇活動類型');
      return false;
    }
    if (!title.trim()) {
      setFormError('請輸入揪團標題');
      return false;
    }
    if (!startDate || !endDate) {
      setFormError('請選擇活動日期');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError('開始日期不能晚於結束日期');
      return false;
    }
    if (type === '滑雪' && !locationId) {
      setFormError('滑雪活動請選擇滑雪場');
      return false;
    }
    if (type === '聚餐' && !customLocation.trim()) {
      setFormError('聚餐活動請輸入地點');
      return false;
    }
    if (
      Number(minPeople) < 1 ||
      Number(maxPeople) < 1 ||
      Number(minPeople) > Number(maxPeople)
    ) {
      setFormError('請輸入有效的人數範圍 (最少人數需小於或等於最多人數)');
      return false;
    }
    if (Number(price) < 0) {
      setFormError('費用不能為負數');
      return false;
    }
    if (!description.trim()) {
      setFormError('請填寫活動描述');
      return false;
    }
    return true;
  }, [
    type,
    title,
    startDate,
    endDate,
    locationId,
    customLocation,
    minPeople,
    maxPeople,
    price,
    description,
  ]);
  const goToNextStep = () => {
    if (validateStep1()) {
      setCurrentStep('step2');
      window.scrollTo(0, 0);
    }
  };
  const goToPrevStep = () => {
    setCurrentStep('step1');
    window.scrollTo(0, 0);
  };
  const handleSubmit = async (e) => {
    /* ... */ e.preventDefault();
    if (currentStep === 'step1' && !validateStep1()) return;
    setIsLoading(true);
    setFormError('');
    const formDataToSend = new FormData();
    formDataToSend.append('type', type);
    formDataToSend.append('title', title);
    formDataToSend.append('start_date', startDate);
    formDataToSend.append('end_date', endDate);
    if (type === '滑雪') {
      formDataToSend.append('location', locationId);
      if (difficulty) {
        formDataToSend.append('difficulty', difficulty);
      }
    } else {
      formDataToSend.append('customLocation', customLocation);
    }
    formDataToSend.append('min_people', String(minPeople));
    formDataToSend.append('max_people', String(maxPeople));
    formDataToSend.append('price', String(price));
    formDataToSend.append('allow_newbie', allowNewbie ? '1' : '0');
    formDataToSend.append('description', description);
    if (coverFile) formDataToSend.append('cover', coverFile);
    try {
      const res = await fetch(`${API_BASE}/api/group`, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: '發生未知錯誤，且無法解析伺服器回應' }));
        throw new Error(errorData.error || `伺服器錯誤: ${res.status}`);
      }
      const newGroup = await res.json();
      alert('揪團建立成功！');
      router.push(`/groups/${newGroup.id}`);
    } catch (err) {
      console.error('建立揪團失敗:', err);
      setFormError('建立失敗：' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formDataForPreview = {
    title,
    type,
    startDate,
    endDate,
    locationId,
    customLocation,
    difficulty,
    minPeople,
    maxPeople,
    price,
    allowNewbie,
    description,
  };

  return (
    // *** 修改主背景色，例如使用 bg-slate-50 或您主題中的 bg-background ***
    // *** text-foreground 也應是您主題中定義的預設文字顏色 ***
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 py-8 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <HorizontalStepper
          steps={STEPS_CONFIG}
          currentStepId={currentStep}
          setCurrentStep={setCurrentStep}
        />

        {formError && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-200 rounded-md"
          >
            {' '}
            {/* 調整錯誤提示顏色 */}
            <div className="flex">
              <div className="flex-shrink-0">
                <span role="img" aria-label="error-icon" className="text-xl">
                  ⚠️
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">發生錯誤</h3>
                <div className="mt-1 text-sm">
                  <p>{formError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:flex lg:gap-8 xl:gap-12">
          <div className="lg:w-7/12 xl:w-2/3">
            <form onSubmit={handleSubmit}>
              {currentStep === 'step1' && (
                // *** 卡片背景使用 bg-white 或您主題的 bg-card，並加上邊框增加區隔 ***
                <Card className="shadow-xl bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      建立您的揪團活動
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      請填寫以下基本資訊來發起您的揪團。
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-2">
                    {/* 活動類型 - Popover + Command */}
                    <div>
                      <Label
                        htmlFor="type-popover-trigger"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        活動類型 <span className="text-red-500">*</span>
                      </Label>
                      <Popover
                        open={openTypePopover}
                        onOpenChange={setOpenTypePopover}
                      >
                        <PopoverTrigger asChild>
                          {/* *** 輸入框/按鈕類使用稍深的背景或更明顯的邊框 *** */}
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTypePopover}
                            id="type-popover-trigger"
                            className="w-full mt-1 justify-between bg-white border-slate-300 text-slate-900 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50 dark:hover:bg-slate-600"
                          >
                            {type
                              ? typeOptions.find((o) => o.value === type)?.label
                              : '請選擇活動類型'}
                            <span className="ml-2 text-xs opacity-50">▼▲</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                          <Command>
                            <CommandInput
                              placeholder="搜尋類型..."
                              className="h-9 border-slate-300 dark:border-slate-700"
                            />
                            <CommandList>
                              <CommandEmpty>找不到類型。</CommandEmpty>
                              <CommandGroup>
                                {typeOptions.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                      setType(currentValue);
                                      setLocationId('');
                                      setCustomLocation('');
                                      setDifficulty('');
                                      setOpenTypePopover(false);
                                    }}
                                    className="hover:bg-slate-100 dark:hover:bg-slate-700 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700"
                                  >
                                    <span
                                      className={`mr-2 h-4 w-4 ${type === option.value ? 'opacity-100 font-bold' : 'opacity-0'}`}
                                    >
                                      ✓
                                    </span>
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* 其他表單欄位使用類似的調整邏輯 */}
                    <div>
                      <Label
                        htmlFor="title"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        揪團標題 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例如：週末輕鬆滑雪新手團"
                        className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      <div>
                        <Label
                          htmlFor="startDate"
                          className="font-medium text-slate-700 dark:text-slate-300"
                        >
                          開始日期 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:[color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="endDate"
                          className="font-medium text-slate-700 dark:text-slate-300"
                        >
                          結束日期 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:[color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="location-popover-trigger"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        活動地點 <span className="text-red-500">*</span>
                      </Label>
                      {type === '滑雪' ? (
                        <Popover
                          open={openLocationPopover}
                          onOpenChange={setOpenLocationPopover}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openLocationPopover}
                              id="location-popover-trigger"
                              className="w-full mt-1 justify-between bg-white border-slate-300 text-slate-900 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50 dark:hover:bg-slate-600"
                            >
                              {locationId
                                ? locationOptions.find(
                                    (l) => String(l.id) === locationId
                                  )?.name
                                : '請選擇滑雪場'}
                              <span className="ml-2 text-xs opacity-50">
                                ▼▲
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                            <Command>
                              <CommandInput
                                placeholder="搜尋滑雪場..."
                                className="h-9 border-slate-300 dark:border-slate-700"
                              />
                              <CommandList>
                                <CommandEmpty>找不到滑雪場。</CommandEmpty>
                                <CommandGroup>
                                  {locationOptions.map((loc) => (
                                    <CommandItem
                                      key={loc.id}
                                      value={loc.name}
                                      onSelect={() => {
                                        setLocationId(String(loc.id));
                                        setOpenLocationPopover(false);
                                      }}
                                      className="hover:bg-slate-100 dark:hover:bg-slate-700 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700"
                                    >
                                      <span
                                        className={`mr-2 h-4 w-4 ${locationId === String(loc.id) ? 'opacity-100 font-bold' : 'opacity-0'}`}
                                      >
                                        ✓
                                      </span>
                                      {loc.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Input
                          id="customLocation"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder={
                            type === '聚餐'
                              ? '請輸入餐廳名稱與地址'
                              : '請輸入詳細活動地點'
                          }
                          className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                        />
                      )}
                    </div>
                    {type === '滑雪' && (
                      <div>
                        <Label
                          htmlFor="difficulty-popover-trigger"
                          className="font-medium text-slate-700 dark:text-slate-300"
                        >
                          滑雪難易度
                        </Label>
                        <Popover
                          open={openDifficultyPopover}
                          onOpenChange={setOpenDifficultyPopover}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openDifficultyPopover}
                              id="difficulty-popover-trigger"
                              className="w-full mt-1 justify-between bg-white border-slate-300 text-slate-900 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50 dark:hover:bg-slate-600"
                            >
                              {difficulty
                                ? skiDifficultyOptions.find(
                                    (o) => o.value === difficulty
                                  )?.label
                                : '選擇難易度 (可選)'}
                              <span className="ml-2 text-xs opacity-50">
                                ▼▲
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                            <Command>
                              <CommandList>
                                <CommandEmpty>找不到難易度。</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      setDifficulty('');
                                      setOpenDifficultyPopover(false);
                                    }}
                                    className="hover:bg-slate-100 dark:hover:bg-slate-700 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700"
                                  >
                                    <span
                                      className={`mr-2 h-4 w-4 ${difficulty === '' ? 'opacity-100 font-bold' : 'opacity-0'}`}
                                    >
                                      ✓
                                    </span>
                                    不指定
                                  </CommandItem>
                                  {skiDifficultyOptions.map((o) => (
                                    <CommandItem
                                      key={o.value}
                                      value={o.value}
                                      onSelect={(currentValue) => {
                                        setDifficulty(currentValue);
                                        setOpenDifficultyPopover(false);
                                      }}
                                      className="hover:bg-slate-100 dark:hover:bg-slate-700 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700"
                                    >
                                      <span
                                        className={`mr-2 h-4 w-4 ${difficulty === o.value ? 'opacity-100 font-bold' : 'opacity-0'}`}
                                      >
                                        ✓
                                      </span>
                                      {o.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      <div>
                        <Label
                          htmlFor="minPeople"
                          className="font-medium text-slate-700 dark:text-slate-300"
                        >
                          最少人數 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="minPeople"
                          type="number"
                          min={1}
                          value={minPeople}
                          onChange={(e) =>
                            setMinPeople(Math.max(1, +e.target.value))
                          }
                          className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxPeople"
                          className="font-medium text-slate-700 dark:text-slate-300"
                        >
                          最多人數 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="maxPeople"
                          type="number"
                          min={minPeople}
                          value={maxPeople}
                          onChange={(e) =>
                            setMaxPeople(
                              Math.max(Number(minPeople), +e.target.value)
                            )
                          }
                          className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="price"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        費用 (每人 TWD) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(Math.max(0, +e.target.value))}
                        className="mt-1 bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <Switch
                        id="allowNewbie"
                        checked={allowNewbie}
                        onCheckedChange={setAllowNewbie}
                        className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-slate-200 dark:data-[state=checked]:bg-sky-600 dark:data-[state=unchecked]:bg-slate-600"
                      />
                      <Label
                        htmlFor="allowNewbie"
                        className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        歡迎新手參加
                      </Label>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        活動描述 <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="請詳細描述您的活動內容、行程、注意事項、費用包含項目等..."
                        className="mt-1 min-h-[120px] bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="cover"
                        className="font-medium text-slate-700 dark:text-slate-300"
                      >
                        封面圖片 (建議比例 16:9)
                      </Label>
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) =>
                          e.currentTarget.classList.add(
                            'border-sky-400',
                            'bg-sky-50',
                            'dark:bg-sky-900/30'
                          )
                        }
                        onDragLeave={(e) =>
                          e.currentTarget.classList.remove(
                            'border-sky-400',
                            'bg-sky-50',
                            'dark:bg-sky-900/30'
                          )
                        }
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex h-60 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:border-sky-500 dark:hover:border-sky-600 transition-colors"
                      >
                        {coverPreview ? (
                          <div className="relative w-full h-full group">
                            <img
                              src={coverPreview}
                              alt="封面預覽"
                              className="h-full w-full object-contain rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearCoverImage();
                              }}
                            >
                              <span className="text-lg">✕</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-5xl text-slate-400 dark:text-slate-500">
                              🖼️
                            </span>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                              拖曳圖片到此，或
                              <span className="font-semibold text-sky-600 dark:text-sky-500">
                                點擊上傳
                              </span>
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              PNG, JPG, GIF (最大 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          id="cover"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-4 pt-8">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      type="button"
                      className="text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      放棄
                    </Button>
                    <Button
                      onClick={goToNextStep}
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600"
                    >
                      下一步
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {currentStep === 'step2' && (
                <Card className="shadow-xl bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      確認揪團資訊
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      請仔細核對以下資訊，確認無誤後即可發佈揪團！
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <p>
                        <strong>活動類型：</strong>
                        {type || '未選擇'}
                      </p>
                      <p>
                        <strong>揪團標題：</strong>
                        {title}
                      </p>
                      <p>
                        <strong>開始日期：</strong>
                        {startDate}
                      </p>
                      <p>
                        <strong>結束日期：</strong>
                        {endDate}
                      </p>
                      <p className="md:col-span-2">
                        <strong>活動地點：</strong>
                        {type === '滑雪'
                          ? locationOptions.find(
                              (l) => String(l.id) === String(locationId)
                            )?.name || '未選擇'
                          : customLocation}
                      </p>
                      {type === '滑雪' && difficulty && (
                        <p>
                          <strong>滑雪難易度：</strong>
                          {difficulty || '未指定'}
                        </p>
                      )}
                      <p>
                        <strong>最少人數：</strong>
                        {minPeople} 人
                      </p>
                      <p>
                        <strong>最多人數：</strong>
                        {maxPeople} 人
                      </p>
                      <p className="md:col-span-2">
                        <strong>預估費用：</strong>NT$ {price} / 每人
                      </p>
                      <p className="md:col-span-2">
                        <strong>歡迎新手：</strong>
                        {allowNewbie ? '是' : '否'}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="font-medium">
                        <strong>活動描述：</strong>
                      </p>
                      <p className="whitespace-pre-wrap pl-1 mt-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md min-h-[60px]">
                        {description || '無描述內容'}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-4 pt-8">
                    <Button
                      variant="outline"
                      onClick={goToPrevStep}
                      type="button"
                      disabled={isLoading}
                      className="text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      上一步
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          發佈中...
                        </>
                      ) : (
                        '確認發佈'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </form>
          </div>

          <aside className="hidden lg:block lg:w-5/12 xl:w-1/3 mt-10 lg:mt-0">
            <div className="space-y-6 sticky top-10">
              <LivePreviewCard
                formData={formDataForPreview}
                typeOptions={typeOptions}
                locationOptions={locationOptions}
                skiDifficultyOptions={skiDifficultyOptions}
                coverPreview={coverPreview}
              />
              {currentStep === 'step2' && (
                <Card className="shadow-lg bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center text-sky-600 dark:text-sky-400">
                      <span className="text-xl mr-2">💡</span> 發佈後小提醒
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <p>✓ 揪團發佈後，您可以在「我的揪團」頁面管理。</p>
                    <p>✓ 記得將揪團連結分享給朋友或相關社群！</p>
                    <p>✓ 留意系統通知，即時掌握報名與留言互動。</p>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-500/70 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center text-red-600 dark:text-red-300">
                    <span className="text-xl mr-2">⚠️</span> 注意事項
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-red-700 dark:text-red-300/90 space-y-1">
                  <p>• 請確保揪團資訊真實、準確，避免誤導。</p>
                  <p>• 禁止發佈任何違反平台社群守則的內容。</p>
                  <p>• 揪團涉及費用時，請明確說明收退款規則。</p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
