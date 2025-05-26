'use client';
import useSWR from 'swr';
// import { fetcher } from '@/services/fetcher';
import { fetcherGroup } from '@/services/rest-client/use-fetcher';

export const useGroups = (memberId, token) =>
  useSWR(
    memberId ? [`http://localhost:3005/api/profile/groups`, token] : null,
    ([url, tk]) => fetcherGroup(url, tk)
  );
