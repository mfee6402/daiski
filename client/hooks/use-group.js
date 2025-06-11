'use client';
import { apiURL } from '@/config';
import useSWR from 'swr';

import { fetcherGroup } from '@/services/rest-client/use-fetcher';

export const useGroups = (memberId, token) => {
  return useSWR(
    memberId ? [`${apiURL}/group/user/${memberId}`, token] : null,
    ([url, tk]) => fetcherGroup(url, tk)
  );
};
