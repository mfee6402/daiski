'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';

const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then((m) => m.CKEditor),
  { ssr: false } // ← 關鍵，避免「window 未定義」錯誤
);

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/* -------- 自訂 Upload Adapter (上傳圖片) -------- */
class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  async upload() {
    const file = await this.loader.file;
    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch('/api/uploads/ckeditor', {
      method: 'POST',
      body: fd,
      credentials: 'include', // 若需帶 cookie
    });
    if (!res.ok) throw new Error('上傳失敗');
    const { url } = await res.json(); // 後端須回 { url: '/uploads/xxx.jpg' }
    return { default: url }; // CKEditor 只吃這格式
  }
  abort() {}
}

function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
    new UploadAdapter(loader);
}

/* -------- 元件 -------- */
export default function RichEditor({ value = '', onChange }) {
  const handleChange = useCallback(
    (_, editor) => onChange(editor.getData()),
    [onChange]
  );

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        language: 'zh', // 工具列中文
        extraPlugins: [uploadPlugin], // 啟用自訂上傳
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'blockQuote',
          'insertTable',
          'undo',
          'redo',
          'imageUpload',
        ],
        image: {
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'imageStyle:inline',
            'imageStyle:block',
          ],
        },
      }}
      onReady={(editor) => {
        // 增加編輯器最小高度
        editor.editing.view.change((writer) => {
          writer.setStyle(
            'min-height',
            '240px',
            editor.editing.view.document.getRoot()
          );
        });
      }}
      onChange={handleChange}
    />
  );
}
