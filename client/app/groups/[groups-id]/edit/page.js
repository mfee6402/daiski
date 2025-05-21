// 檔案路徑: app/groups/[groups-id]/edit/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GroupForm from '../../_components/group-form.js'; // 引入我們共用的表單元件
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'; // 引入 Card 相關元件

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params['groups-id']; // 從 URL 獲取揪團 ID

  const [initialData, setInitialData] = useState(null); // 存放從 API 獲取的揪團初始資料
  const [isLoading, setIsLoading] = useState(true); // 頁面或表單提交的載入狀態
  const [formError, setFormError] = useState(''); // 表單錯誤訊息

  // 表單選項的狀態
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  // 用於觸發地點選項重新載入的狀態 (當活動類型改變時)
  const [currentTypeForLocation, setCurrentTypeForLocation] = useState('');

  // 1. 載入活動類型選項 (與創建頁面邏輯相似)
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
      } catch (err) {
        console.error('編輯頁面 - 載入類型失敗:', err);
        setFormError(`無法載入活動類型選項：${err.message}`);
      }
    }
    loadTypes();
  }, [API_BASE]);

  // 2. 根據 groupId 載入現有揪團的資料
  useEffect(() => {
    if (!groupId) {
      setFormError('無效的揪團 ID。');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    async function fetchGroupDetails() {
      try {
        const res = await fetch(`${API_BASE}/api/group/${groupId}`);
        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: '無法解析伺服器回應' }));
          throw new Error(
            errData.error || `無法獲取揪團資料 (狀態 ${res.status})`
          );
        }
        const data = await res.json();

        // 轉換後端資料格式以匹配 GroupForm 的 initialValues
        // 並設定 coverPreview
        const formattedData = {
          ...data,
          // 後端回傳的 creator 物件可能叫做 user 或 creator
          // GroupForm 內部目前沒有直接使用 organizerId，但如果需要可以加入
          id: data.id, // 確保 ID 被傳遞，GroupForm 會用它來判斷是編輯還是創建模式
          type: data.type || '',
          title: data.title || '',
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split('T')[0]
            : '',
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split('T')[0]
            : '',
          locationId: data.locationId ? String(data.locationId) : '',
          customLocation: data.customLocation || '',
          difficulty: data.difficulty || '',
          minPeople: data.minPeople || 2,
          maxPeople: data.maxPeople || 10,
          price: data.price || 0,
          allowNewbie:
            data.allowNewbie === undefined ? true : Boolean(data.allowNewbie),
          description: data.description || '',
          coverFile: null, // 編輯時，coverFile 初始為 null，除非用戶選擇新檔案
          // 處理封面圖片預覽
          coverPreview:
            data.images && data.images.length > 0 && data.images[0].imageUrl
              ? data.images[0].imageUrl.startsWith('http')
                ? data.images[0].imageUrl
                : `${API_BASE}${data.images[0].imageUrl}`
              : data.cover_image // 假設後端列表也可能回傳 cover_image
                ? data.cover_image.startsWith('http')
                  ? data.cover_image
                  : `${API_BASE}${data.cover_image}`
                : '',
        };
        setInitialData(formattedData);
        setCurrentTypeForLocation(formattedData.type); // 設定當前類型以觸發地點載入
        setFormError(''); // 清除之前的錯誤
      } catch (err) {
        console.error('編輯頁面 - 獲取揪團詳情失敗:', err);
        setFormError(`獲取揪團資料失敗：${err.message}`);
        setInitialData(null); // 確保出錯時 initialData 為空
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupDetails();
  }, [groupId, API_BASE]);

  // 3. 載入滑雪場地點選項 (當 currentTypeForLocation 為 '滑雪' 時)
  useEffect(() => {
    if (currentTypeForLocation !== '滑雪') {
      setLocationOptions([]); // 如果不是滑雪類型，清空地點選項
      return;
    }
    async function loadLocations() {
      try {
        const res = await fetch(`${API_BASE}/api/location`); // 假設這是獲取滑雪場列表的 API
        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: '無法獲取滑雪場列表 (回應非JSON)' }));
          throw new Error(errData.error || `請求失敗: ${res.status}`);
        }
        const list = await res.json();
        setLocationOptions(list || []);
      } catch (err) {
        console.error('編輯頁面 - 載入滑雪場地點失敗:', err);
        setFormError(`無法載入滑雪場列表：${err.message}`);
      }
    }
    loadLocations();
  }, [currentTypeForLocation, API_BASE]);

  // 處理表單提交 (更新揪團)
  const handleEditSubmit = async (formDataFromComponent) => {
    if (!groupId) {
      setFormError('無法更新：缺少揪團 ID。');
      return;
    }
    // 基本前端驗證 (可以做得更完整)
    if (
      !formDataFromComponent.type ||
      !formDataFromComponent.title ||
      !formDataFromComponent.startDate ||
      !formDataFromComponent.endDate
    ) {
      setFormError('請填寫所有必填欄位 (*)。');
      return;
    }
    if (
      new Date(formDataFromComponent.startDate) >
      new Date(formDataFromComponent.endDate)
    ) {
      setFormError('開始日期不能晚於結束日期。');
      return;
    }

    setIsLoading(true);
    setFormError('');

    const formDataToSend = new FormData();
    // 根據 GroupForm 返回的 formDataFromComponent 組裝要發送到後端的 FormData
    // 注意：欄位名稱需要與後端 API (PUT /api/group/:groupId) 期望的一致
    formDataToSend.append('type', formDataFromComponent.type);
    formDataToSend.append('title', formDataFromComponent.title);
    formDataToSend.append('start_date', formDataFromComponent.startDate); // 後端期望 start_date
    formDataToSend.append('end_date', formDataFromComponent.endDate); // 後端期望 end_date

    if (formDataFromComponent.type === '滑雪') {
      if (formDataFromComponent.locationId) {
        formDataToSend.append('location', formDataFromComponent.locationId); // 後端期望 location 作為 ID
      }
      if (formDataFromComponent.difficulty) {
        formDataToSend.append('difficulty', formDataFromComponent.difficulty);
      }
    } else {
      if (formDataFromComponent.customLocation) {
        formDataToSend.append(
          'customLocation',
          formDataFromComponent.customLocation
        );
      }
    }
    formDataToSend.append(
      'min_people',
      String(formDataFromComponent.minPeople)
    ); // 後端期望 min_people
    formDataToSend.append(
      'max_people',
      String(formDataFromComponent.maxPeople)
    ); // 後端期望 max_people
    formDataToSend.append('price', String(formDataFromComponent.price));
    formDataToSend.append(
      'allow_newbie',
      formDataFromComponent.allowNewbie ? '1' : '0'
    );
    formDataToSend.append('description', formDataFromComponent.description);

    if (formDataFromComponent.coverFile instanceof File) {
      formDataToSend.append('cover', formDataFromComponent.coverFile); // 後端期望 'cover' 作為檔案欄位名
    }
    // 注意：organizerId 通常不由前端在編輯時提交，後端應通過身份驗證來確認操作者權限

    try {
      const res = await fetch(`${API_BASE}/api/group/${groupId}`, {
        method: 'PUT',
        body: formDataToSend,
        // 如果您的後端 PUT 路由需要 JWT token 進行身份驗證，您需要在這裡加入 headers
        // headers: {
        //   'Authorization': `Bearer ${your_auth_token}`, // 從您的身份驗證系統獲取 token
        // },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: '更新失敗，且無法解析伺服器回應' }));
        throw new Error(errorData.error || `伺服器錯誤: ${res.status}`);
      }
      alert('揪團更新成功！');
      router.push(`/groups/${groupId}`); // 成功後導向回揪團詳細頁面
      router.refresh(); // 嘗試刷新頁面以獲取最新數據 (Next.js 13+ App Router)
    } catch (err) {
      console.error('更新揪團失敗:', err);
      setFormError(`更新失敗：${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 當 GroupForm 內部資料變化時的回呼，主要用於更新 currentTypeForLocation
  const handleFormChangeForEdit = useCallback(
    (formDataFromComponent) => {
      if (formDataFromComponent.type !== currentTypeForLocation) {
        setCurrentTypeForLocation(formDataFromComponent.type);
      }
      // 如果您在編輯頁面也有即時預覽，可以在這裡更新預覽的狀態
      // setPreviewFormData(formDataFromComponent);
      // setPreviewCover(coverPreviewFromComponent);
    },
    [currentTypeForLocation]
  );

  // 處理初始資料載入中的情況
  if (isLoading && !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-sky-600"
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
        載入揪團資料中...
      </div>
    );
  }

  // 處理初始資料載入失敗或找不到揪團的情況
  if (!initialData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              錯誤
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              {formError || '找不到指定的揪團資料，或載入時發生錯誤。'}
            </p>
            <Button
              onClick={() => router.push('/groups')}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              返回揪團列表
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 當 initialData 載入完成後，渲染 GroupForm
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-screen-lg mx-auto">
        {/* 編輯頁面通常不需要步驟條，直接顯示表單 */}
        {/* 錯誤訊息顯示區塊 */}
        {formError &&
          !isLoading && ( // 只在非載入中時顯示表單級別的錯誤
            <div
              role="alert"
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/70 text-red-700 dark:text-red-200 rounded-md shadow-sm"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="錯誤圖示" className="text-xl">
                    ⚠️
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">操作時發生錯誤</h3>
                  <div className="mt-1 text-sm">
                    <p>{formError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        <GroupForm
          initialValues={initialData} // 將從 API 獲取的資料作為初始值傳入
          onSubmit={handleEditSubmit} // 提交表單時呼叫的函式
          isLoading={isLoading} // 控制提交按鈕的載入狀態
          submitButtonText="儲存變更" // 設定提交按鈕的文字
          typeOptions={typeOptions} // 活動類型選項
          locationOptions={locationOptions} // 滑雪場地點選項
          // skiDifficultyOptions 可以使用 GroupForm 內部的預設值，或從這裡傳入
          formError={formError} // 將錯誤訊息傳給 GroupForm 內部可能也需要顯示
          setFormError={setFormError} // 允許 GroupForm 設定或清除錯誤
          onFormDataChange={handleFormChangeForEdit} // 當表單資料變化時的回呼
        />
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/groups/${groupId}`)} // 返回到詳細頁面
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-6 py-2"
            disabled={isLoading}
          >
            取消編輯
          </Button>
        </div>
      </div>
    </main>
  );
}
