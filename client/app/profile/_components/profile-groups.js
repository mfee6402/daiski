'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import useSWR from 'swr';
// import { fetcher } from '@/services/rest-client/use-fetcher';
// import { fetcher } from '@/services/fetcher';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useGroups } from '@/hooks/use-group';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfileGroups(props) {
  // 讀取會員ＩＤ
  const { user, isAuth, token } = useAuth(); // 依你的 useAuth 實作
  const { data, isLoading, error } = useGroups(isAuth ? user.id : null, token);

  if (!isAuth) return <p className="text-sm">尚未登入</p>;
  if (isLoading) return <p className="text-sm">載入中…</p>;
  if (error) return <p className="text-sm text-destructive">讀取失敗</p>;

  const groups = data?.groups ?? [];

  return (
    <>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>已報名團隊活動</CardTitle>
          <CardDescription>共 {groups.length} 筆</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {groups.length === 0 && (
            <p className="text-muted-foreground">目前沒有任何報名紀錄。</p>
          )}

          {groups.map((g) => (
            <article key={g.id} className="flex gap-4 rounded-lg border p-4">
              <Image
                src={
                  g.imageUrl
                    ? `http://localhost:3005${g.imageUrl}`
                    : 'deadicon.png'
                }
                alt={g.title}
                width={10}
                height={10}
                className="size-24 flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.time}</p>
                <p className="text-sm">
                  {g.location === 'null' ? g.customLocation : g.location}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/groups/${g.id}`}>查看</Link>
              </Button>
            </article>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
