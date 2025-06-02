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
import { IoLocationOutline } from 'react-icons/io5';
import { HiCalendarDateRange } from 'react-icons/hi2';
import { GiArtificialHive } from 'react-icons/gi';
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

  const groups = data?.memberships ?? [];
  console.log(groups);
  return (
    <>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>已報名團隊活動</CardTitle>
          <CardDescription>共 {groups.length} 筆</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-3">
          {groups.length === 0 && (
            <p className="text-muted-foreground">目前沒有任何報名紀錄。</p>
          )}

          {groups.map((g) => (
            <article
              key={g.groupMemberId}
              className="flex gap-4 rounded-lg border p-4"
            >
              <div></div>
              <Image
                src={
                  g.group.imageUrl
                    ? `http://localhost:3005${g.group.imageUrl}`
                    : 'deadicon.png'
                }
                // onError={() => setImg('/deadicon.png')}
                alt={g.group.title}
                width={20}
                height={20}
                className="w-1/2 flex-shrink-0 rounded-md object-cover aspect-[4/3]"
              />
              <div className="flex flex-col justify-center items-start gap-3">
                <div className="font-medium flex">
                  <GiArtificialHive />
                  {g.group.title}
                </div>
                <div className="flex text-sm text-muted-foreground ">
                  <HiCalendarDateRange className="size-10" />
                  {g.group.time}
                </div>
                <div className="text-sm flex">
                  <IoLocationOutline />
                  {g.group.location === 'null'
                    ? g.customLocation
                    : g.group.location}
                </div>
              </div>
              <Button asChild variant="outline" key={g.groupMemberId}>
                <Link href={`/groups/${g.group.groupId}`}>查看</Link>
              </Button>
            </article>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
