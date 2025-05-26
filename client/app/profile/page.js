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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// 優惠卷引入
import ProfileCoupons from './_components/profile-coupons';
// 收藏引入
import ProfileWishlist from './_components/profile-wishlist';

//揪團頁引入
import ProfileGroups from './_components/profile-groups';
import Container from '@/components/container';
//Bio區塊的驗證 schema  限制字數上限
const FormSchema = z.object({
  bio: z.string().max(2000, {
    message: '自我簡介上限1000字 ',
  }),
});

export default function MemberPage() {
  //Bio區塊，使用Textarea+form元件的變數宣告
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { bio: '' }, // 建議加上預設值，避免未定義警告
  });

  function onSubmit(values) {
    toast.success('更新成功！', {
      description: (
        <div className=" rounded-md ">
          {/* <code className="text-white">{JSON.stringify(values, null, 2)}</code> */}
        </div>
      ),
      duration: 2000,
    });
  }

  return (
    <div className="min-h-screen bg-[url('/home-images/layer2.png')] bg-cover bg-center bg-no-repeat">
      <Container className="  ">
        {/* Header */}
        <header className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <Avatar className="w-48 h-48 ">
            {/* TODO: Replace src with the real member avatar */}
            <AvatarImage
              src="/avatar.webp"
              alt="member avatar"
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="text-3xl font-semibold bg-secondary-500 text-white">
              ME
            </AvatarFallback>
          </Avatar>
          <h1 className="text-h6-tw font-medium tracking-tight text-base">
            會員中心
          </h1>
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

              <CardContent className="space-y-6">
                <div>
                  {/* shadcn 的 Form 只是 Context Provider，不會輸出 <form> 標籤 */}
                  <Form {...form}>
                    {/* 這裡保留唯一的 <form>，負責整段提交 */}
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* ---- React-Hook-Form 欄位 ---- */}
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>個人簡介</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us a little bit about yourself"
                                className="resize-none  overflow-y-auto h-64 max-h-64 "
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ---- 其他 Input 也放在同一個 form 中 ---- */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Input your name" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" placeholder="you@example.com" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="phone">電話</Label>
                          <Input id="phone" placeholder="09xx-xxx-xxx" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>開啟選單</DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>My Account</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Profile</DropdownMenuItem>
                              <DropdownMenuItem>Billing</DropdownMenuItem>
                              <DropdownMenuItem>Team</DropdownMenuItem>
                              <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* 送出按鈕 */}
                      <Button type="submit">更新</Button>
                    </form>
                  </Form>
                </div>
                {/* ------- */}
              </CardContent>

              <CardFooter></CardFooter>
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
              <ProfileWishlist />
              {/* <CardHeader>
                <CardTitle>我的收藏</CardTitle>
                <CardDescription>
                  您喜愛的商品或文章將會顯示在此。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">尚未收藏任何項目。</p>
              </CardContent> */}
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <ProfileCoupons />
              {/* <CardHeader>
                <CardTitle>優惠卷</CardTitle>
              </CardHeader> */}
              {/* <CardContent>
                <p className="text-sm text-gray-500">暫時沒有可用優惠卷。</p>
              </CardContent> */}
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
              <ProfileGroups />
              {/* <CardHeader>
                <CardTitle>揪團</CardTitle>
                <CardDescription>查看與管理您的揪團活動。</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">尚未參加任何揪團。</p>
              </CardContent> */}
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
