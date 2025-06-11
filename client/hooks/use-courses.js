// src/hooks/use-courses.js
'use client';
import { apiURL } from '@/config';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export const useCourses = (userId) =>
  useSWR(
    userId ? `${apiURL}/profile/courses/${userId}/courses` : null,
    fetcher
  );
