'use client';
//==== 其他頁面取用Token ====
import React, { useState, useEffect, use } from 'react';

export default function Test2Page(props) {
  useEffect(function () {
    const token = localStorage.getItem('tokenBox');
    console.log('token', token);
    async function getUser() {
      const response = await fetch('http://localhost:3005/api/auth/test', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      console.log('data', data);
    }
    getUser();
  }, []);
  //====End Token取用====
  return (
    <>
      <div>Test2 Page</div>
    </>
  );
}
