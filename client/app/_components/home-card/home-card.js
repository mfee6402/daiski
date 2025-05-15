'use client';

import React, { useState, useEffect } from 'react';
import Card from './card';

export default function HomeCard(props) {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-10 px-[clamp(0.25rem,calc(0.25rem+0.35*(100vw-640px)),20rem)] py-[clamp(3rem,calc(3rem+0.018*(100vw-640px)),4rem)]">
        <h2 className="text-h6-en sm:text-h2-en">DAISKI 滑雪俱樂部</h2>
        <p className="text-p-tw text-center">
          我們致力於提供頂級滑雪課程和高品質的滑雪用具選購服務，搭配專業且經驗豐富的教練團隊，為各年齡層與不同滑雪水平的您打造量身定制的滑雪體驗。
          <br />
          無論您是初學者還是資深滑雪者，我們的教練皆能根據您的需求提供個性化指導，協助您快速提升技能，盡情享受滑雪樂趣。
        </p>
        <ul className="flex flex-col">
          <Card title="滑雪教學" imgSrc="./home-images/img_ins.x.png" />
        </ul>
      </section>
    </>
  );
}
