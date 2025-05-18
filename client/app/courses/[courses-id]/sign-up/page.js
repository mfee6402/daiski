'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
export default function SignUpPage(props) {
  const [birthdate, setbirthDate] = useState('');

  return (
    <>
      <main className="mt-6 mb-6">
        <form className="max-w-3xl mx-auto">
          <Card className="p-8 space-y-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                S3 第三彈 野澤溫泉&東京五日行
              </CardTitle>
              {/* 課程日期 */}
              <CardDescription className="mt-4">
                日期: 2025/01/12 ~ 2025/01/16
              </CardDescription>
              {/* 時長 */}
              <CardDescription className="mt-4">時數: 20小時</CardDescription>
              {/* 上課地點 */}
              <CardDescription className="mt-4">地點: 野澤溫泉</CardDescription>
              {/* 售價 */}
              <CardDescription className="mt-4">
                費用: <span className=" text-red">NT$65,900</span>
              </CardDescription>
            </CardHeader>
            <hr />
            <CardContent>
              <p>學員基本資料</p>
            </CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6">
              <div className="grid gap-2">
                <Label htmlFor="email">姓名</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="請輸入真實姓名"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">電話</Label>
                <Input type="text" id="phone" placeholder="" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="example@mail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">生日</Label>
                <Input
                  id="bd"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setbirthDate(e.target.value)}
                />{' '}
              </div>
            </div>
            <hr />
            <CardContent>
              <p>課程內容</p>
            </CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 space-y-3">
              <div>
                <p className="font-medium">第一天：集合 & 技術檢測</p>
                <p className="text-sm text-gray-600">
                  抵達滑雪場、裝備檢查、技巧分組
                </p>
              </div>
              <div>
                <p className="font-medium">第二天：姿勢優化與轉彎控制</p>
                <p className="text-sm text-gray-600">
                  學習重心轉換與平行轉彎技巧
                </p>
              </div>
              <div>
                <p className="font-medium">第三天：雪況應對實作</p>
                <p className="text-sm text-gray-600">
                  在不同雪況下練習滑行與控制
                </p>
              </div>
              <div>
                <p className="font-medium">第四天：模擬競賽與挑戰</p>
                <p className="text-sm text-gray-600">接力滑行、障礙路線訓練</p>
              </div>
              <div>
                <p className="font-medium">第五天：成果驗收與頒獎</p>
                <p className="text-sm text-gray-600">
                  技能檢核、證書頒發與自由時間
                </p>
              </div>
            </div>
            <hr />
            <CardContent className="flex justify-center px-6">
              <p>《報名須知與退費政策》</p>
            </CardContent>
            <CardFooter>
              <ScrollArea className="h-[200px] w-[680px] rounded-md border p-4 mt-0">
                為保障您的權益，請詳細閱讀以下內容，並於報名前確認您已完全理解並同意本政策：
                一、報名須知 1.報名資格 本課程適合年滿 6
                歲以上身心健康者參加。未滿 18
                歲者需由法定監護人陪同或簽署同意書。 2.裝備說明
                課程不含個人裝備租借費用，若有需要請提前於租借頁面辦理。
                3.行前通知
                課程相關資訊（集合地點、時間、注意事項）將於課程前三日透過電子郵件通知，請務必填寫正確聯絡方式。
                4.保險說明
                課程費用包含基本旅遊平安保險。如需額外保險保障，請自行加保。
                二、退費政策 1.開課前 14 日（含）以前取消 可全額退費，將酌收 5%
                手續費。 2.開課前 7～13 日內取消 可退回已繳費用之 50%。 3.開課前
                6 日內或未到課 恕不退費，亦不得補課或轉讓。
                4.因天候或不可抗力因素取消課程
                主辦單位將提供延期或全額退費選項，無須負擔手續費。
              </ScrollArea>
            </CardFooter>
            <div className="flex justify-center px-6">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                我已閱讀並同意上述《報名須知與退費政策》內容。
              </label>
            </div>
            <hr />
            <div className="flex justify-center px-6 gap-4">
              <Button variant="outline">取消</Button>
              <Button>加入購物車</Button>
            </div>
          </Card>
        </form>
      </main>
    </>
  );
}
