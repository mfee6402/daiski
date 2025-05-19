'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
export default function CreateCoursePage(props) {
  const [formData, setFormData] = useState({
    // courses table
    name: '',
    description: '',
    content: '',
    start_at: '',
    end_at: '',
    // course_details table
    difficulty: '',
    price: '',
    duration: '',
    max_people: '',
    location_id: '',
    course_img: null,
  });

  const difficultyOptions = ['初級', '中級', '高級'];
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });
    // TODO: call your後端 API，例如：
    // await fetch('/api/courses', { method: 'POST', body: payload });
  };
  return (
    <>
      <div>CreateCourse</div>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>新增滑雪課程</CardTitle>
            <CardDescription>請填寫下列欄位，快速建立新課程</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            {/* 課程基本資訊 */}
            <div>
              <Label htmlFor="name" className="mb-2">
                課程名稱
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="請輸入課程名稱"
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                課程簡介
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="簡短介紹課程亮點"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content" className="mb-2">
                詳細內容
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="每日行程或課程大綱"
                rows={4}
              />
            </div>

            {/* 時間 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_at" className="mb-2">
                  開始時間
                </Label>
                <Input
                  id="start_at"
                  name="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="end_at" className="mb-2">
                  結束時間
                </Label>
                <Input
                  id="end_at"
                  name="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 課程細節 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="difficulty">難度等級</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="" disabled>
                    請選擇難度
                  </option>
                  {difficultyOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="price" className="mb-2">
                  價格 (TWD)
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="例如：3000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="duration" className="mb-2">
                  時長 (小時)
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="例如：5"
                />
              </div>
              <div>
                <Label htmlFor="max_people" className="mb-2">
                  人數上限
                </Label>
                <Input
                  id="max_people"
                  name="max_people"
                  type="number"
                  value={formData.max_people}
                  onChange={handleChange}
                  placeholder="例如：10"
                />
              </div>
            </div>

            {/* 地點 & 上傳圖片 */}
            <div>
              <Label htmlFor="location_id" className="mb-2">
                地點
              </Label>
              <select
                id="location_id"
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">請選擇地點</option>
                {/* TODO: 後端取得 location list */}
              </select>
            </div>

            <div>
              <Label htmlFor="course_img" className="mb-2">
                課程圖片
              </Label>
              <Input
                id="course_img"
                name="course_img"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button type="submit">建立課程</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
