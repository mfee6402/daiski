'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MemberPage() {
  return (
    <div className="min-h-screen bg-[url('/home-images/layer2.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-5xl mx-auto px-4 py-10 space-y-10  ">
        {/* Header */}
        <header className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <Avatar className="w-48 h-48 ">
            {/* TODO: Replace src with the real member avatar */}
            <AvatarImage src="/avatar.jpg" alt="member avatar" />
            <AvatarFallback className="text-3xl font-semibold bg-secondary-500 text-white">
              ME
            </AvatarFallback>
          </Avatar>
          <h1 className="text-h6-tw font-medium tracking-tight text-base">會員中心</h1>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="info">會員資訊</TabsTrigger>
            <TabsTrigger value="orders">訂單紀錄</TabsTrigger>
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            <TabsTrigger value="coupons">優惠卷</TabsTrigger>
            <TabsTrigger value="courses">課程</TabsTrigger>
            <TabsTrigger value="groups">揪團</TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="info" className="space-y-6">
            {/* Example Card inside a tab */}
            <Card>
              <CardHeader>
                <CardTitle>基本資料</CardTitle>
                <CardDescription>
                  更新您的個人信息以保持資料最新。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 ">
                {/* ------- */}  
                    <form>
                      <div className="grid w-1/3 items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Input your name" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="email">email</Label>
                          <Input id="name" placeholder="" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="phone">電話</Label>
                          <Input id="name" placeholder="" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="framework">Framework</Label>
                          <Select>
                            <SelectTrigger id="framework">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="next">Next.js</SelectItem>
                              <SelectItem value="sveltekit">
                                SvelteKit
                              </SelectItem>
                              <SelectItem value="astro">Astro</SelectItem>
                              <SelectItem value="nuxt">Nuxt.js</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </form>
                {/* ------- */}
              </CardContent>
              <CardFooter>
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition flex justify-between">
                  編輯資料
                </button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>訂單紀錄</CardTitle>
                <CardDescription>查看並管理您的歷史訂單。</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">目前沒有任何訂單紀錄。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>我的收藏</CardTitle>
                <CardDescription>
                  您喜愛的商品或文章將會顯示在此。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">尚未收藏任何項目。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <CardHeader>
                <CardTitle>優惠卷</CardTitle>
                <CardDescription>您的可用優惠卷列表。</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">暫時沒有可用優惠卷。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>課程</CardTitle>
                <CardDescription>追蹤您已報名的課程。</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">您尚未加入任何課程。</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>揪團</CardTitle>
                <CardDescription>查看與管理您的揪團活動。</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">尚未參加任何揪團。</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
